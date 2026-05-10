import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ModuleSummary } from '../../common/module-summary.interface';
import { User } from '../users/entities/user.entity';
import { Vehicle, VehicleRegime } from '../vehicles/entities/vehicle.entity';
import { CreateVerificationCenterDto } from './dto/create-verification-center.dto';
import { CreateVerificationEventDto } from './dto/create-verification-event.dto';
import { CreateVerificationObligationDto } from './dto/create-verification-obligation.dto';
import { CreateVerificationScheduleRuleDto } from './dto/create-verification-schedule-rule.dto';
import { QueryVerificationCentersDto } from './dto/query-verification-centers.dto';
import { QueryVerificationEventsDto } from './dto/query-verification-events.dto';
import { QueryVerificationObligationsDto } from './dto/query-verification-obligations.dto';
import { QueryVerificationScheduleRulesDto } from './dto/query-verification-schedule-rules.dto';
import { RespondVerificationObligationDto } from './dto/respond-verification-obligation.dto';
import { ScheduleVerificationObligationDto } from './dto/schedule-verification-obligation.dto';
import { VerificationCenter } from './entities/verification-center.entity';
import { VerificationEvent } from './entities/verification-event.entity';
import { VerificationObligationHistory } from './entities/verification-obligation-history.entity';
import { VerificationObligation } from './entities/verification-obligation.entity';
import { VerificationScheduleRule } from './entities/verification-schedule-rule.entity';
import {
  VerificationObligationHistoryAction,
  VerificationObligationStatus,
  VerificationOwnerResponse,
  VerificationResultStatus,
  VerificationType,
} from './entities/verifications.enums';

const UPCOMING_THRESHOLD_DAYS = 30;

type VehicleRegulatoryStatusCode =
  | 'VIGENTE'
  | 'POR_VENCER'
  | 'VENCIDO'
  | 'SIN_REGISTRO'
  | 'NO_APLICA'
  | 'INACTIVO';

@Injectable()
export class VerificationsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(VerificationCenter)
    private readonly centerRepository: Repository<VerificationCenter>,
    @InjectRepository(VerificationEvent)
    private readonly eventRepository: Repository<VerificationEvent>,
    @InjectRepository(VerificationObligation)
    private readonly obligationRepository: Repository<VerificationObligation>,
    @InjectRepository(VerificationObligationHistory)
    private readonly obligationHistoryRepository: Repository<VerificationObligationHistory>,
    @InjectRepository(VerificationScheduleRule)
    private readonly scheduleRuleRepository: Repository<VerificationScheduleRule>,
  ) {}

  getModuleSummary(): ModuleSummary {
    return {
      key: 'verifications',
      route: '/verifications',
      phase: 2,
      purpose:
        'Controla eventos de verificacion, calendario por regimen, obligaciones pendientes y estado regulatorio.',
      tables: [
        'verification_events',
        'verification_schedule_rules',
        'verification_centers',
        'verification_obligations',
        'verification_obligation_history',
      ],
    };
  }

  getCatalogs() {
    return {
      regimes: Object.values(VehicleRegime),
      verificationTypes: Object.values(VerificationType),
      resultStatuses: Object.values(VerificationResultStatus),
      obligationStatuses: Object.values(VerificationObligationStatus),
      ownerResponses: Object.values(VerificationOwnerResponse),
      obligationHistoryActions: Object.values(VerificationObligationHistoryAction),
    };
  }

  async getVehicleRegulatoryStatus(vehicleId: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: this.normalizeId(vehicleId, 'vehicleId') },
      relations: {
        verificationEvents: {
          center: true,
        },
        verificationObligations: {
          ownerUser: true,
          adminUser: true,
          scheduledCenter: true,
          verificationEvent: {
            center: true,
          },
        },
      },
      order: {
        verificationEvents: {
          eventDate: 'DESC',
          createdAt: 'DESC',
        },
        verificationObligations: {
          dueDate: 'ASC',
          createdAt: 'DESC',
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('No se encontro el vehiculo indicado.');
    }

    const scheduleRulePosition = this.getScheduleRulePosition(vehicle.regime);
    const [physicalScheduleRule, emissionsScheduleRule] = await Promise.all([
      this.findActiveScheduleRule(
        vehicle.regime,
        vehicle.scheduleMarkerEffective,
        scheduleRulePosition,
        VerificationType.PHYSICAL_MECHANICAL,
      ),
      this.findActiveScheduleRule(
        vehicle.regime,
        vehicle.scheduleMarkerEffective,
        scheduleRulePosition,
        VerificationType.EMISSIONS,
      ),
    ]);

    const physicalStatus = this.buildVerificationStatusSnapshot(
      vehicle,
      VerificationType.PHYSICAL_MECHANICAL,
      true,
      physicalScheduleRule,
    );
    const emissionsStatus = this.buildVerificationStatusSnapshot(
      vehicle,
      VerificationType.EMISSIONS,
      this.requiresEmissions(vehicle),
      emissionsScheduleRule,
    );

    return {
      vehicle: {
        id: vehicle.id,
        plate: vehicle.plate,
        serialNiv: vehicle.serialNiv,
        engineNumber: vehicle.engineNumber,
        unitType: vehicle.unitType,
        regime: vehicle.regime,
        isActive: vehicle.isActive,
        scheduleMarkerAuto: vehicle.scheduleMarkerAuto,
        scheduleMarkerOverride: vehicle.scheduleMarkerOverride,
        scheduleMarkerEffective: vehicle.scheduleMarkerEffective,
        scheduleRulePosition,
      },
      thresholdDaysToUpcoming: UPCOMING_THRESHOLD_DAYS,
      overallStatus: this.getOverallRegulatoryStatus(vehicle, [
        physicalStatus,
        emissionsStatus,
      ]),
      physical: physicalStatus,
      emissions: emissionsStatus,
    };
  }

  async listCenters(query: QueryVerificationCentersDto) {
    const qb = this.centerRepository.createQueryBuilder('center');

    if (query.centerType) {
      qb.andWhere('center.centerType = :centerType', {
        centerType: query.centerType.trim(),
      });
    }

    if (query.stateCode) {
      qb.andWhere('center.stateCode = :stateCode', {
        stateCode: query.stateCode.trim().toUpperCase(),
      });
    }

    const isActive = this.parseOptionalBoolean(query.isActive, 'isActive');
    if (isActive !== undefined) {
      qb.andWhere('center.isActive = :isActive', { isActive });
    }

    if (query.search?.trim()) {
      const search = `%${query.search.trim()}%`;
      qb.andWhere(
        '(center.name ILIKE :search OR center.code ILIKE :search OR center.city ILIKE :search)',
        { search },
      );
    }

    qb.orderBy('center.name', 'ASC');

    const [items, total] = await qb.getManyAndCount();

    return {
      total,
      items: items.map((center) => this.mapCenter(center)),
    };
  }

  async createCenter(dto: CreateVerificationCenterDto) {
    const centerType = this.requireText(dto.centerType, 'centerType');
    const code = this.requireText(dto.code, 'code').toUpperCase();
    const name = this.requireText(dto.name, 'name');

    try {
      const entity = this.centerRepository.create({
        centerType,
        code,
        name,
        stateCode: this.optionalUppercaseText(dto.stateCode),
        city: this.optionalText(dto.city),
        addressLine: this.optionalText(dto.addressLine),
        contactName: this.optionalText(dto.contactName),
        phone: this.optionalText(dto.phone),
        email: this.optionalText(dto.email),
        isActive: dto.isActive ?? true,
      });

      const saved = await this.centerRepository.save(entity);

      return this.mapCenter(saved);
    } catch (error) {
      this.handlePersistenceError(error, 'No fue posible crear el centro de verificacion.');
    }
  }

  async listScheduleRules(query: QueryVerificationScheduleRulesDto) {
    const qb = this.scheduleRuleRepository.createQueryBuilder('rule');

    if (query.regime) {
      qb.andWhere('rule.regime = :regime', { regime: query.regime });
    }

    if (query.verificationType) {
      qb.andWhere('rule.verificationType = :verificationType', {
        verificationType: query.verificationType,
      });
    }

    if (query.scheduleMarker) {
      qb.andWhere('rule.scheduleMarker = :scheduleMarker', {
        scheduleMarker: this.normalizeMarker(query.scheduleMarker, 'scheduleMarker'),
      });
    }

    const isActive = this.parseOptionalBoolean(query.isActive, 'isActive');
    if (isActive !== undefined) {
      qb.andWhere('rule.isActive = :isActive', { isActive });
    }

    qb.orderBy('rule.regime', 'ASC')
      .addOrderBy('rule.verificationType', 'ASC')
      .addOrderBy('rule.schedulePosition', 'ASC')
      .addOrderBy('rule.scheduleMarker', 'ASC');

    const [items, total] = await qb.getManyAndCount();

    return {
      total,
      items: items.map((rule) => this.mapScheduleRule(rule)),
    };
  }

  async createScheduleRule(dto: CreateVerificationScheduleRuleDto) {
    const regime = this.ensureEnumValue(dto.regime, VehicleRegime, 'regime');
    const verificationType = this.ensureEnumValue(
      dto.verificationType,
      VerificationType,
      'verificationType',
    );

    try {
      const entity = this.scheduleRuleRepository.create({
        regime,
        verificationType,
        schedulePosition: this.parseSmallInt(
          dto.schedulePosition,
          'schedulePosition',
          1,
          10,
        ),
        scheduleMarker: this.normalizeMarker(dto.scheduleMarker, 'scheduleMarker'),
        windowStartMonth: this.parseSmallInt(
          dto.windowStartMonth,
          'windowStartMonth',
          1,
          12,
        ),
        windowEndMonth: this.parseSmallInt(
          dto.windowEndMonth,
          'windowEndMonth',
          1,
          12,
        ),
        windowLabel: this.requireText(dto.windowLabel, 'windowLabel'),
        isActive: dto.isActive ?? true,
        notes: this.optionalText(dto.notes),
      });

      const saved = await this.scheduleRuleRepository.save(entity);

      return this.mapScheduleRule(saved);
    } catch (error) {
      this.handlePersistenceError(error, 'No fue posible crear la regla de calendario.');
    }
  }

  async listEvents(query: QueryVerificationEventsDto) {
    const qb = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.vehicle', 'vehicle')
      .leftJoinAndSelect('event.center', 'center');

    if (query.vehicleId) {
      qb.andWhere('vehicle.id = :vehicleId', {
        vehicleId: this.normalizeId(query.vehicleId, 'vehicleId'),
      });
    }

    if (query.centerId) {
      qb.andWhere('center.id = :centerId', {
        centerId: this.normalizeId(query.centerId, 'centerId'),
      });
    }

    if (query.verificationType) {
      qb.andWhere('event.verificationType = :verificationType', {
        verificationType: query.verificationType,
      });
    }

    if (query.resultStatus) {
      qb.andWhere('event.resultStatus = :resultStatus', {
        resultStatus: query.resultStatus,
      });
    }

    if (query.fromDate) {
      qb.andWhere('event.eventDate >= :fromDate', {
        fromDate: this.parseDateOnly(query.fromDate, 'fromDate'),
      });
    }

    if (query.toDate) {
      qb.andWhere('event.eventDate <= :toDate', {
        toDate: this.parseDateOnly(query.toDate, 'toDate'),
      });
    }

    qb.orderBy('event.eventDate', 'DESC').addOrderBy('event.createdAt', 'DESC');

    const [items, total] = await qb.getManyAndCount();

    return {
      total,
      items: items.map((event) => this.mapEvent(event)),
    };
  }

  async getEventById(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id: this.normalizeId(id, 'id') },
      relations: {
        vehicle: true,
        center: true,
      },
    });

    if (!event) {
      throw new NotFoundException('No se encontro el evento de verificacion.');
    }

    return this.mapEvent(event);
  }

  async createEvent(dto: CreateVerificationEventDto) {
    const vehicleId = this.normalizeId(dto.vehicleId, 'vehicleId');
    const verificationType = this.ensureEnumValue(
      dto.verificationType,
      VerificationType,
      'verificationType',
    );
    const eventDate = this.parseDateOnly(dto.eventDate, 'eventDate');
    const validUntil = this.parseDateOnly(dto.validUntil, 'validUntil');
    const resultStatus = dto.resultStatus
      ? this.ensureEnumValue(dto.resultStatus, VerificationResultStatus, 'resultStatus')
      : VerificationResultStatus.PASSED;

    return this.eventRepository.manager.transaction(async (manager) => {
      const vehicleRepository = manager.getRepository(Vehicle);
      const centerRepository = manager.getRepository(VerificationCenter);
      const eventRepository = manager.getRepository(VerificationEvent);
      const obligationRepository = manager.getRepository(VerificationObligation);
      const historyRepository = manager.getRepository(VerificationObligationHistory);
      const userRepository = manager.getRepository(User);

      const vehicle = await vehicleRepository.findOneBy({ id: vehicleId });
      if (!vehicle) {
        throw new NotFoundException('No se encontro el vehiculo indicado.');
      }

      const center = dto.centerId
        ? await this.findCenterOrFailWithRepository(
            centerRepository,
            dto.centerId,
            'centerId',
          )
        : null;

      const event = eventRepository.create({
        vehicle,
        center,
        verificationType,
        eventDate,
        validUntil,
        resultStatus,
        certificateFolio: this.optionalText(dto.certificateFolio),
        observations: this.optionalText(dto.observations),
      });

      const savedEvent = await eventRepository.save(event);

      let completedObligationId: string | null = null;

      if (dto.verificationObligationId) {
        const obligation = await obligationRepository.findOne({
          where: { id: this.normalizeId(dto.verificationObligationId, 'verificationObligationId') },
          relations: {
            vehicle: true,
            ownerUser: true,
            adminUser: true,
            scheduledCenter: true,
            verificationEvent: true,
          },
        });

        if (!obligation) {
          throw new NotFoundException(
            'No se encontro la obligacion de verificacion indicada.',
          );
        }

        if (obligation.vehicle.id !== vehicle.id) {
          throw new BadRequestException(
            'La obligacion indicada no corresponde al vehiculo del evento.',
          );
        }

        if (obligation.verificationType !== verificationType) {
          throw new BadRequestException(
            'La obligacion indicada no coincide con el tipo de verificacion.',
          );
        }

        if (
          obligation.status === VerificationObligationStatus.COMPLETED ||
          obligation.status === VerificationObligationStatus.CANCELLED
        ) {
          throw new BadRequestException(
            'La obligacion indicada ya no puede marcarse como completada.',
          );
        }

        if (obligation.verificationEvent) {
          throw new BadRequestException(
            'La obligacion indicada ya tiene un evento de verificacion asociado.',
          );
        }

        const adminUser = dto.adminUserId
          ? await this.findUserOrFailWithRepository(
              userRepository,
              dto.adminUserId,
              'adminUserId',
            )
          : null;

        const previousStatus = obligation.status;
        const previousOwnerResponse = obligation.ownerResponse;

        obligation.verificationEvent = savedEvent;
        obligation.status = VerificationObligationStatus.COMPLETED;
        obligation.closedAt = new Date();
        obligation.adminUser = adminUser ?? obligation.adminUser;
        obligation.scheduledCenter = obligation.scheduledCenter ?? center;
        obligation.notes = this.mergeNotes(obligation.notes, dto.completionNotes);

        await obligationRepository.save(obligation);

        const historyEntry = historyRepository.create({
          obligation,
          changedByUser: adminUser,
          actionType: VerificationObligationHistoryAction.COMPLETED,
          previousStatus,
          newStatus: obligation.status,
          previousOwnerResponse,
          newOwnerResponse: obligation.ownerResponse,
          notes: this.optionalText(dto.completionNotes),
        });

        await historyRepository.save(historyEntry);
        completedObligationId = obligation.id;
      }

      const created = await eventRepository.findOne({
        where: { id: savedEvent.id },
        relations: {
          vehicle: true,
          center: true,
        },
      });

      if (!created) {
        throw new NotFoundException(
          'No fue posible recuperar el evento de verificacion recien creado.',
        );
      }

      return {
        ...this.mapEvent(created),
        completedObligationId,
      };
    });
  }

  async listObligations(query: QueryVerificationObligationsDto) {
    const includeHistory = this.parseOptionalBoolean(
      query.includeHistory,
      'includeHistory',
    );

    const qb = this.obligationRepository
      .createQueryBuilder('obligation')
      .leftJoinAndSelect('obligation.vehicle', 'vehicle')
      .leftJoinAndSelect('obligation.ownerUser', 'ownerUser')
      .leftJoinAndSelect('obligation.adminUser', 'adminUser')
      .leftJoinAndSelect('obligation.scheduledCenter', 'scheduledCenter')
      .leftJoinAndSelect('obligation.verificationEvent', 'verificationEvent');

    if (includeHistory) {
      qb.leftJoinAndSelect('obligation.historyEntries', 'history').leftJoinAndSelect(
        'history.changedByUser',
        'historyChangedByUser',
      );
    }

    if (query.vehicleId) {
      qb.andWhere('vehicle.id = :vehicleId', {
        vehicleId: this.normalizeId(query.vehicleId, 'vehicleId'),
      });
    }

    if (query.status) {
      qb.andWhere('obligation.status = :status', {
        status: query.status,
      });
    }

    if (query.verificationType) {
      qb.andWhere('obligation.verificationType = :verificationType', {
        verificationType: query.verificationType,
      });
    }

    if (query.ownerResponse) {
      qb.andWhere('obligation.ownerResponse = :ownerResponse', {
        ownerResponse: query.ownerResponse,
      });
    }

    if (query.ownerUserId) {
      qb.andWhere('ownerUser.id = :ownerUserId', {
        ownerUserId: this.normalizeId(query.ownerUserId, 'ownerUserId'),
      });
    }

    if (query.adminUserId) {
      qb.andWhere('adminUser.id = :adminUserId', {
        adminUserId: this.normalizeId(query.adminUserId, 'adminUserId'),
      });
    }

    if (query.dueFrom) {
      qb.andWhere('obligation.dueDate >= :dueFrom', {
        dueFrom: this.parseDateOnly(query.dueFrom, 'dueFrom'),
      });
    }

    if (query.dueTo) {
      qb.andWhere('obligation.dueDate <= :dueTo', {
        dueTo: this.parseDateOnly(query.dueTo, 'dueTo'),
      });
    }

    qb.orderBy('obligation.dueDate', 'ASC').addOrderBy('obligation.createdAt', 'DESC');

    if (includeHistory) {
      qb.addOrderBy('history.createdAt', 'ASC');
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      total,
      items: items.map((obligation) =>
        this.mapObligation(obligation, includeHistory ?? false),
      ),
    };
  }

  async getObligationById(id: string) {
    const obligation = await this.obligationRepository.findOne({
      where: { id: this.normalizeId(id, 'id') },
      relations: {
        vehicle: true,
        ownerUser: true,
        adminUser: true,
        scheduledCenter: true,
        verificationEvent: {
          center: true,
        },
        historyEntries: {
          changedByUser: true,
        },
      },
      order: {
        historyEntries: {
          createdAt: 'ASC',
        },
      },
    });

    if (!obligation) {
      throw new NotFoundException('No se encontro la obligacion de verificacion.');
    }

    return this.mapObligation(obligation, true);
  }

  async createObligation(dto: CreateVerificationObligationDto) {
    const vehicle = await this.findVehicleOrFail(dto.vehicleId, 'vehicleId');
    const verificationType = this.ensureEnumValue(
      dto.verificationType,
      VerificationType,
      'verificationType',
    );
    const dueDate = this.parseDateOnly(dto.dueDate, 'dueDate');
    const windowStartDate = this.parseDateOnly(dto.windowStartDate, 'windowStartDate');
    const windowEndDate = this.parseDateOnly(dto.windowEndDate, 'windowEndDate');
    const ownerUser = dto.ownerUserId
      ? await this.findUserOrFail(dto.ownerUserId, 'ownerUserId')
      : null;
    const adminUser = dto.adminUserId
      ? await this.findUserOrFail(dto.adminUserId, 'adminUserId')
      : null;

    try {
      return await this.obligationRepository.manager.transaction(async (manager) => {
        const obligationRepository = manager.getRepository(VerificationObligation);
        const historyRepository = manager.getRepository(VerificationObligationHistory);

        const obligation = obligationRepository.create({
          vehicle,
          verificationType,
          dueDate,
          windowStartDate,
          windowEndDate,
          status: VerificationObligationStatus.PENDING,
          ownerUser,
          adminUser,
          notes: this.optionalText(dto.notes),
        });

        const saved = await obligationRepository.save(obligation);

        const historyEntry = historyRepository.create({
          obligation: saved,
          changedByUser: adminUser,
          actionType: VerificationObligationHistoryAction.CREATED,
          previousStatus: null,
          newStatus: saved.status,
          previousOwnerResponse: null,
          newOwnerResponse: saved.ownerResponse,
          notes: this.optionalText(dto.notes),
        });

        await historyRepository.save(historyEntry);

        const created = await obligationRepository.findOne({
          where: { id: saved.id },
          relations: {
            vehicle: true,
            ownerUser: true,
            adminUser: true,
            scheduledCenter: true,
            verificationEvent: true,
            historyEntries: {
              changedByUser: true,
            },
          },
        });

        if (!created) {
          throw new NotFoundException(
            'No fue posible recuperar la obligacion de verificacion creada.',
          );
        }

        return this.mapObligation(created, true);
      });
    } catch (error) {
      this.handlePersistenceError(
        error,
        'No fue posible crear la obligacion de verificacion.',
      );
    }
  }

  async respondToObligation(id: string, dto: RespondVerificationObligationDto) {
    const obligation = await this.findObligationOrFail(id);
    this.ensureObligationCanBeUpdated(obligation);

    const ownerUser = await this.findUserOrFail(dto.ownerUserId, 'ownerUserId');
    const ownerResponse = this.ensureEnumValue(
      dto.ownerResponse,
      VerificationOwnerResponse,
      'ownerResponse',
    );

    const previousStatus = obligation.status;
    const previousOwnerResponse = obligation.ownerResponse;

    obligation.ownerUser = ownerUser;
    obligation.ownerResponse = ownerResponse;
    obligation.ownerResponseAt = new Date();
    obligation.status = this.mapOwnerResponseToStatus(ownerResponse);
    obligation.notes = this.mergeNotes(obligation.notes, dto.notes);

    await this.obligationRepository.save(obligation);

    const historyEntry = this.obligationHistoryRepository.create({
      obligation,
      changedByUser: ownerUser,
      actionType: VerificationObligationHistoryAction.OWNER_RESPONSE,
      previousStatus,
      newStatus: obligation.status,
      previousOwnerResponse,
      newOwnerResponse: obligation.ownerResponse,
      notes: this.optionalText(dto.notes),
    });

    await this.obligationHistoryRepository.save(historyEntry);

    return this.getObligationById(obligation.id);
  }

  async scheduleObligation(id: string, dto: ScheduleVerificationObligationDto) {
    const obligation = await this.findObligationOrFail(id);
    this.ensureObligationCanBeUpdated(obligation);

    const adminUser = await this.findUserOrFail(dto.adminUserId, 'adminUserId');
    const scheduledCenter = await this.findCenterOrFail(
      dto.scheduledCenterId,
      'scheduledCenterId',
    );
    const scheduledFor = this.parseDateTime(dto.scheduledFor, 'scheduledFor');

    const previousStatus = obligation.status;
    const previousOwnerResponse = obligation.ownerResponse;

    obligation.adminUser = adminUser;
    obligation.scheduledCenter = scheduledCenter;
    obligation.scheduledFor = scheduledFor;
    obligation.status = VerificationObligationStatus.SCHEDULED;
    obligation.notes = this.mergeNotes(obligation.notes, dto.notes);

    await this.obligationRepository.save(obligation);

    const historyEntry = this.obligationHistoryRepository.create({
      obligation,
      changedByUser: adminUser,
      actionType: VerificationObligationHistoryAction.SCHEDULED,
      previousStatus,
      newStatus: obligation.status,
      previousOwnerResponse,
      newOwnerResponse: obligation.ownerResponse,
      notes: this.optionalText(dto.notes),
    });

    await this.obligationHistoryRepository.save(historyEntry);

    return this.getObligationById(obligation.id);
  }

  private async findActiveScheduleRule(
    regime: VehicleRegime,
    scheduleMarker: string,
    schedulePosition: number,
    verificationType: VerificationType,
  ) {
    return this.scheduleRuleRepository.findOne({
      where: {
        regime,
        scheduleMarker,
        schedulePosition,
        verificationType,
        isActive: true,
      },
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  private buildVerificationStatusSnapshot(
    vehicle: Vehicle,
    verificationType: VerificationType,
    required: boolean,
    scheduleRule: VerificationScheduleRule | null,
  ) {
    if (!required) {
      return {
        required: false,
        status: 'NO_APLICA' as VehicleRegulatoryStatusCode,
        daysToDue: null,
        referenceDate: null,
        statusSource: 'NOT_APPLICABLE',
        scheduleRule: scheduleRule ? this.mapScheduleRule(scheduleRule) : null,
        lastEvent: null,
        lastCompliantEvent: null,
        activeObligation: null,
      };
    }

    if (!vehicle.isActive) {
      return {
        required: true,
        status: 'INACTIVO' as VehicleRegulatoryStatusCode,
        daysToDue: null,
        referenceDate: null,
        statusSource: 'INACTIVE',
        scheduleRule: scheduleRule ? this.mapScheduleRule(scheduleRule) : null,
        lastEvent: null,
        lastCompliantEvent: null,
        activeObligation: null,
      };
    }

    const verificationEvents = vehicle.verificationEvents
      .filter((event) => event.verificationType === verificationType)
      .sort((left, right) =>
        this.compareDateLike(right.eventDate, left.eventDate) ||
        this.compareDateLike(right.createdAt, left.createdAt),
      );

    const lastEvent = verificationEvents[0] ?? null;
    const lastCompliantEvent =
      verificationEvents.find((event) =>
        [VerificationResultStatus.PASSED, VerificationResultStatus.CONDITIONAL].includes(
          event.resultStatus,
        ),
      ) ?? null;

    const activeObligation =
      vehicle.verificationObligations
        .filter(
          (obligation) =>
            obligation.verificationType === verificationType &&
            ![
              VerificationObligationStatus.COMPLETED,
              VerificationObligationStatus.CANCELLED,
            ].includes(obligation.status),
        )
        .sort(
          (left, right) =>
            this.compareDateLike(left.dueDate, right.dueDate) ||
            this.compareDateLike(right.createdAt, left.createdAt),
        )[0] ?? null;

    if (lastCompliantEvent) {
      const daysToDue = this.getDaysUntil(lastCompliantEvent.validUntil);
      return {
        required: true,
        status: this.getStatusFromDays(daysToDue),
        daysToDue,
        referenceDate: lastCompliantEvent.validUntil,
        statusSource: 'EVENT',
        scheduleRule: scheduleRule ? this.enrichScheduleRule(scheduleRule) : null,
        lastEvent: lastEvent ? this.mapEvent(lastEvent) : null,
        lastCompliantEvent: this.mapEvent(lastCompliantEvent),
        activeObligation: activeObligation
          ? this.mapObligationSummary(activeObligation)
          : null,
      };
    }

    if (activeObligation) {
      const daysToDue = this.getDaysUntil(activeObligation.dueDate);
      return {
        required: true,
        status: this.getStatusFromDays(daysToDue, true),
        daysToDue,
        referenceDate: activeObligation.dueDate,
        statusSource: 'OBLIGATION',
        scheduleRule: scheduleRule ? this.enrichScheduleRule(scheduleRule) : null,
        lastEvent: lastEvent ? this.mapEvent(lastEvent) : null,
        lastCompliantEvent: null,
        activeObligation: this.mapObligationSummary(activeObligation),
      };
    }

    return {
      required: true,
      status: 'SIN_REGISTRO' as VehicleRegulatoryStatusCode,
      daysToDue: null,
      referenceDate: null,
      statusSource: 'NONE',
      scheduleRule: scheduleRule ? this.enrichScheduleRule(scheduleRule) : null,
      lastEvent: lastEvent ? this.mapEvent(lastEvent) : null,
      lastCompliantEvent: null,
      activeObligation: null,
    };
  }

  private getOverallRegulatoryStatus(
    vehicle: Vehicle,
    statuses: Array<{ status: VehicleRegulatoryStatusCode; required: boolean }>,
  ) {
    if (!vehicle.isActive) {
      return 'INACTIVO' as VehicleRegulatoryStatusCode;
    }

    const requiredStatuses = statuses
      .filter((entry) => entry.required)
      .map((entry) => entry.status);

    if (requiredStatuses.length === 0) {
      return 'NO_APLICA' as VehicleRegulatoryStatusCode;
    }

    if (requiredStatuses.includes('VENCIDO')) {
      return 'VENCIDO';
    }

    if (requiredStatuses.includes('POR_VENCER')) {
      return 'POR_VENCER';
    }

    if (requiredStatuses.includes('SIN_REGISTRO')) {
      return 'SIN_REGISTRO';
    }

    if (requiredStatuses.every((status) => status === 'VIGENTE')) {
      return 'VIGENTE';
    }

    return requiredStatuses[0];
  }

  private getScheduleRulePosition(regime: VehicleRegime) {
    return regime === VehicleRegime.FEDERAL ? 3 : 4;
  }

  private requiresEmissions(vehicle: Vehicle) {
    const normalizedUnitType = vehicle.unitType.trim().toUpperCase();

    return ![
      'ARRASTRE',
      'REMOLQUE',
      'SEMIRREMOLQUE',
      'DOLLY',
      'PLATAFORMA',
      'CAJA SECA',
    ].some((keyword) => normalizedUnitType.includes(keyword));
  }

  private getStatusFromDays(
    daysToDue: number,
    allowMissingFallback = false,
  ): VehicleRegulatoryStatusCode {
    if (daysToDue < 0) {
      return 'VENCIDO';
    }

    if (daysToDue <= UPCOMING_THRESHOLD_DAYS) {
      return 'POR_VENCER';
    }

    if (allowMissingFallback && Number.isNaN(daysToDue)) {
      return 'SIN_REGISTRO';
    }

    return 'VIGENTE';
  }

  private getDaysUntil(dateValue: string) {
    const today = this.getCurrentLocalDate();
    const targetDate = this.parseDateOnlyToDate(dateValue);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    return Math.floor((targetDate.getTime() - today.getTime()) / millisecondsPerDay);
  }

  private getCurrentLocalDate() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  private parseDateOnlyToDate(dateValue: string) {
    const [year, month, day] = dateValue.split('-').map((value) => Number(value));
    return new Date(year, month - 1, day);
  }

  private compareDateLike(left: string | Date, right: string | Date) {
    const leftTime =
      left instanceof Date ? left.getTime() : this.parseDateOnlyToDate(left).getTime();
    const rightTime =
      right instanceof Date ? right.getTime() : this.parseDateOnlyToDate(right).getTime();

    return leftTime - rightTime;
  }

  private enrichScheduleRule(scheduleRule: VerificationScheduleRule) {
    const currentMonth = this.getCurrentLocalDate().getMonth() + 1;
    const isCurrentMonthInWindow =
      scheduleRule.windowStartMonth <= scheduleRule.windowEndMonth
        ? currentMonth >= scheduleRule.windowStartMonth &&
          currentMonth <= scheduleRule.windowEndMonth
        : currentMonth >= scheduleRule.windowStartMonth ||
          currentMonth <= scheduleRule.windowEndMonth;

    return {
      ...this.mapScheduleRule(scheduleRule),
      isCurrentMonthInWindow,
    };
  }

  private mapObligationSummary(obligation: VerificationObligation) {
    return {
      id: obligation.id,
      verificationType: obligation.verificationType,
      dueDate: obligation.dueDate,
      windowStartDate: obligation.windowStartDate,
      windowEndDate: obligation.windowEndDate,
      status: obligation.status,
      ownerResponse: obligation.ownerResponse,
      ownerResponseAt: obligation.ownerResponseAt,
      scheduledFor: obligation.scheduledFor,
      scheduledCenter: obligation.scheduledCenter
        ? this.mapCenter(obligation.scheduledCenter)
        : null,
      ownerUser: obligation.ownerUser
        ? this.mapUserSummary(obligation.ownerUser)
        : null,
      adminUser: obligation.adminUser
        ? this.mapUserSummary(obligation.adminUser)
        : null,
      verificationEventId: obligation.verificationEvent?.id ?? null,
      notes: obligation.notes,
    };
  }

  private async findVehicleOrFail(id: string, fieldName: string) {
    const vehicle = await this.vehicleRepository.findOneBy({
      id: this.normalizeId(id, fieldName),
    });

    if (!vehicle) {
      throw new NotFoundException('No se encontro el vehiculo indicado.');
    }

    return vehicle;
  }

  private async findUserOrFail(id: string, fieldName: string) {
    return this.findUserOrFailWithRepository(this.userRepository, id, fieldName);
  }

  private async findCenterOrFail(id: string, fieldName: string) {
    return this.findCenterOrFailWithRepository(this.centerRepository, id, fieldName);
  }

  private async findUserOrFailWithRepository(
    repository: Repository<User>,
    id: string,
    fieldName: string,
  ) {
    const user = await repository.findOneBy({
      id: this.normalizeId(id, fieldName),
    });

    if (!user) {
      throw new NotFoundException('No se encontro el usuario indicado.');
    }

    return user;
  }

  private async findCenterOrFailWithRepository(
    repository: Repository<VerificationCenter>,
    id: string,
    fieldName: string,
  ) {
    const center = await repository.findOneBy({
      id: this.normalizeId(id, fieldName),
    });

    if (!center) {
      throw new NotFoundException('No se encontro el centro de verificacion indicado.');
    }

    return center;
  }

  private async findObligationOrFail(id: string) {
    const obligation = await this.obligationRepository.findOne({
      where: { id: this.normalizeId(id, 'id') },
      relations: {
        vehicle: true,
        ownerUser: true,
        adminUser: true,
        scheduledCenter: true,
        verificationEvent: true,
      },
    });

    if (!obligation) {
      throw new NotFoundException('No se encontro la obligacion de verificacion.');
    }

    return obligation;
  }

  private ensureObligationCanBeUpdated(obligation: VerificationObligation) {
    if (
      obligation.status === VerificationObligationStatus.COMPLETED ||
      obligation.status === VerificationObligationStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'La obligacion ya no puede modificarse en su estado actual.',
      );
    }
  }

  private mapOwnerResponseToStatus(ownerResponse: VerificationOwnerResponse) {
    switch (ownerResponse) {
      case VerificationOwnerResponse.CONFIRMED:
        return VerificationObligationStatus.OWNER_CONFIRMED;
      case VerificationOwnerResponse.DECLINED:
        return VerificationObligationStatus.OWNER_DECLINED;
      case VerificationOwnerResponse.REQUEST_ASSISTANCE:
      case VerificationOwnerResponse.REQUEST_RESCHEDULE:
        return VerificationObligationStatus.REQUESTED_ASSISTANCE;
      default:
        throw new BadRequestException('La respuesta del propietario no es valida.');
    }
  }

  private mapCenter(center: VerificationCenter) {
    return {
      id: center.id,
      centerType: center.centerType,
      code: center.code,
      name: center.name,
      stateCode: center.stateCode,
      city: center.city,
      addressLine: center.addressLine,
      contactName: center.contactName,
      phone: center.phone,
      email: center.email,
      isActive: center.isActive,
      createdAt: center.createdAt,
      updatedAt: center.updatedAt,
    };
  }

  private mapScheduleRule(rule: VerificationScheduleRule) {
    return {
      id: rule.id,
      regime: rule.regime,
      schedulePosition: rule.schedulePosition,
      scheduleMarker: rule.scheduleMarker,
      verificationType: rule.verificationType,
      windowStartMonth: rule.windowStartMonth,
      windowEndMonth: rule.windowEndMonth,
      windowLabel: rule.windowLabel,
      isActive: rule.isActive,
      notes: rule.notes,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    };
  }

  private mapEvent(event: VerificationEvent) {
    return {
      id: event.id,
      verificationType: event.verificationType,
      eventDate: event.eventDate,
      validUntil: event.validUntil,
      resultStatus: event.resultStatus,
      certificateFolio: event.certificateFolio,
      observations: event.observations,
      vehicle: event.vehicle
        ? {
            id: event.vehicle.id,
            plate: event.vehicle.plate,
            regime: event.vehicle.regime,
            unitType: event.vehicle.unitType,
          }
        : null,
      center: event.center ? this.mapCenter(event.center) : null,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }

  private mapObligation(
    obligation: VerificationObligation,
    includeHistory: boolean,
  ) {
    return {
      id: obligation.id,
      verificationType: obligation.verificationType,
      dueDate: obligation.dueDate,
      windowStartDate: obligation.windowStartDate,
      windowEndDate: obligation.windowEndDate,
      status: obligation.status,
      ownerResponse: obligation.ownerResponse,
      ownerResponseAt: obligation.ownerResponseAt,
      scheduledFor: obligation.scheduledFor,
      closedAt: obligation.closedAt,
      notes: obligation.notes,
      vehicle: {
        id: obligation.vehicle.id,
        plate: obligation.vehicle.plate,
        regime: obligation.vehicle.regime,
        unitType: obligation.vehicle.unitType,
      },
      ownerUser: obligation.ownerUser
        ? this.mapUserSummary(obligation.ownerUser)
        : null,
      adminUser: obligation.adminUser
        ? this.mapUserSummary(obligation.adminUser)
        : null,
      scheduledCenter: obligation.scheduledCenter
        ? this.mapCenter(obligation.scheduledCenter)
        : null,
      verificationEvent: obligation.verificationEvent
        ? this.mapEvent(obligation.verificationEvent)
        : null,
      history: includeHistory
        ? (obligation.historyEntries ?? []).map((entry) => this.mapHistoryEntry(entry))
        : undefined,
      createdAt: obligation.createdAt,
      updatedAt: obligation.updatedAt,
    };
  }

  private mapHistoryEntry(entry: VerificationObligationHistory) {
    return {
      id: entry.id,
      actionType: entry.actionType,
      previousStatus: entry.previousStatus,
      newStatus: entry.newStatus,
      previousOwnerResponse: entry.previousOwnerResponse,
      newOwnerResponse: entry.newOwnerResponse,
      notes: entry.notes,
      changedByUser: entry.changedByUser
        ? this.mapUserSummary(entry.changedByUser)
        : null,
      createdAt: entry.createdAt,
    };
  }

  private mapUserSummary(user: User) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
    };
  }

  private ensureEnumValue<T extends string>(
    value: T,
    enumeration: Record<string, T>,
    fieldName: string,
  ) {
    if (!Object.values(enumeration).includes(value)) {
      throw new BadRequestException(`El campo ${fieldName} no es valido.`);
    }

    return value;
  }

  private requireText(value: string | undefined, fieldName: string) {
    const normalized = this.optionalText(value);

    if (!normalized) {
      throw new BadRequestException(`El campo ${fieldName} es obligatorio.`);
    }

    return normalized;
  }

  private optionalText(value: string | undefined | null) {
    if (value === undefined || value === null) {
      return null;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  private optionalUppercaseText(value: string | undefined | null) {
    const normalized = this.optionalText(value);
    return normalized ? normalized.toUpperCase() : null;
  }

  private normalizeId(value: string | undefined, fieldName: string) {
    const normalized = this.requireText(value, fieldName);

    if (!/^\d+$/.test(normalized)) {
      throw new BadRequestException(`El campo ${fieldName} debe ser un identificador numerico.`);
    }

    return normalized;
  }

  private normalizeMarker(value: string | undefined, fieldName: string) {
    const normalized = this.requireText(value, fieldName).toUpperCase();

    if (!/^[A-Z0-9]$/.test(normalized)) {
      throw new BadRequestException(
        `El campo ${fieldName} debe contener un solo caracter alfanumerico.`,
      );
    }

    return normalized;
  }

  private parseSmallInt(
    value: number | string | undefined,
    fieldName: string,
    min: number,
    max: number,
  ) {
    if (value === undefined || value === null || value === '') {
      throw new BadRequestException(`El campo ${fieldName} es obligatorio.`);
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
      throw new BadRequestException(
        `El campo ${fieldName} debe ser un entero entre ${min} y ${max}.`,
      );
    }

    return parsed;
  }

  private parseDateOnly(value: string | undefined, fieldName: string) {
    const normalized = this.requireText(value, fieldName);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      throw new BadRequestException(
        `El campo ${fieldName} debe tener formato YYYY-MM-DD.`,
      );
    }

    const parsed = new Date(`${normalized}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(`El campo ${fieldName} no contiene una fecha valida.`);
    }

    return normalized;
  }

  private parseDateTime(value: string | undefined, fieldName: string) {
    const normalized = this.requireText(value, fieldName);
    const parsed = new Date(normalized);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(
        `El campo ${fieldName} no contiene una fecha-hora valida.`,
      );
    }

    return parsed;
  }

  private parseOptionalBoolean(value: string | undefined, fieldName: string) {
    if (value === undefined) {
      return undefined;
    }

    const normalized = value.trim().toLowerCase();

    if (normalized === 'true' || normalized === '1') {
      return true;
    }

    if (normalized === 'false' || normalized === '0') {
      return false;
    }

    throw new BadRequestException(
      `El campo ${fieldName} debe ser true o false cuando se envie.`,
    );
  }

  private mergeNotes(existing: string | null, incoming: string | undefined) {
    const normalizedIncoming = this.optionalText(incoming);
    if (!normalizedIncoming) {
      return existing;
    }

    const normalizedExisting = this.optionalText(existing);
    if (!normalizedExisting) {
      return normalizedIncoming;
    }

    return `${normalizedExisting}\n${normalizedIncoming}`;
  }

  private handlePersistenceError(error: unknown, fallbackMessage: string): never {
    if (
      error instanceof QueryFailedError &&
      (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code ===
        '23505'
    ) {
      throw new BadRequestException('El registro ya existe con una llave unica incompatible.');
    }

    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }

    throw new BadRequestException(fallbackMessage);
  }
}
