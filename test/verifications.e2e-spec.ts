import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { hashSync } from 'bcryptjs';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import { AdminGuard } from '../src/modules/auth/guards/admin.guard';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { User } from '../src/modules/users/entities/user.entity';
import {
  UserVehicleAccess,
  UserVehicleAccessType,
} from '../src/modules/vehicles/entities/user-vehicle-access.entity';
import { Vehicle, VehicleRegime } from '../src/modules/vehicles/entities/vehicle.entity';
import { VerificationsController } from '../src/modules/verifications/verifications.controller';
import { VerificationsService } from '../src/modules/verifications/verifications.service';
import { VerificationCenter } from '../src/modules/verifications/entities/verification-center.entity';
import { VerificationEvent } from '../src/modules/verifications/entities/verification-event.entity';
import { VerificationObligationHistory } from '../src/modules/verifications/entities/verification-obligation-history.entity';
import { VerificationObligation } from '../src/modules/verifications/entities/verification-obligation.entity';
import { VerificationScheduleRule } from '../src/modules/verifications/entities/verification-schedule-rule.entity';
import {
  VerificationObligationHistoryAction,
  VerificationObligationStatus,
  VerificationOwnerResponse,
  VerificationResultStatus,
  VerificationType,
} from '../src/modules/verifications/entities/verifications.enums';

describe('Verifications protected endpoints (e2e)', () => {
  let app: INestApplication;

  let users: User[];
  let primaryVehicle: Vehicle;
  let centers: VerificationCenter[];
  let obligations: VerificationObligation[];
  let historyEntries: VerificationObligationHistory[];
  let events: VerificationEvent[];

  function createUser(params: {
    id: string;
    email: string;
    fullName: string;
    isAdmin: boolean;
  }) {
    return {
      id: params.id,
      email: params.email,
      passwordHash: hashSync('Secret123!', 10),
      fullName: params.fullName,
      isAdmin: params.isAdmin,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      party: null,
      vehicleAccesses: [],
      grantedVehicleAccesses: [],
      ownerVerificationResponses: [],
      adminVerificationUpdates: [],
      verificationObligationHistoryEntries: [],
      uploadedDocuments: [],
      uploadedDocumentFiles: [],
    } as User;
  }

  function createCenter(params: {
    id: string;
    code: string;
    name: string;
  }) {
    return {
      id: params.id,
      centerType: 'VERIFICENTRO',
      code: params.code,
      name: params.name,
      stateCode: 'NL',
      city: 'Monterrey',
      addressLine: 'Av. Taller 100',
      contactName: 'Mesa Operativa',
      phone: '8181818181',
      email: 'agenda@centro.local',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      verificationEvents: [],
      verificationObligations: [],
    } as VerificationCenter;
  }

  function createEvent(params: {
    id: string;
    vehicle: Vehicle;
    verificationType: VerificationType;
    eventDate: string;
    validUntil: string;
    resultStatus?: VerificationResultStatus;
    center?: VerificationCenter | null;
    certificateFolio?: string | null;
  }) {
    return {
      id: params.id,
      vehicle: params.vehicle,
      center: params.center ?? null,
      verificationType: params.verificationType,
      eventDate: params.eventDate,
      validUntil: params.validUntil,
      resultStatus: params.resultStatus ?? VerificationResultStatus.PASSED,
      certificateFolio: params.certificateFolio ?? null,
      observations: null,
      sourceDocument: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      linkedObligations: [],
      verificationObligations: [],
    } as VerificationEvent;
  }

  function createObligation(params: {
    id: string;
    vehicle: Vehicle;
    verificationType: VerificationType;
    ownerUser: User;
  }) {
    return {
      id: params.id,
      vehicle: params.vehicle,
      verificationType: params.verificationType,
      dueDate: '2026-06-30',
      windowStartDate: '2026-01-01',
      windowEndDate: '2026-06-30',
      status: VerificationObligationStatus.PENDING,
      ownerResponse: null,
      ownerResponseAt: null,
      ownerUser: params.ownerUser,
      adminUser: null,
      scheduledCenter: null,
      scheduledFor: null,
      verificationEvent: null,
      closedAt: null,
      notes: 'Pendiente inicial generada por pruebas.',
      createdAt: new Date(),
      updatedAt: new Date(),
      historyEntries: [],
    } as VerificationObligation;
  }

  function createHistoryEntry(params: {
    id: string;
    obligation: VerificationObligation;
    changedByUser: User | null;
    actionType: VerificationObligationHistoryAction;
    previousStatus: VerificationObligationStatus | null;
    newStatus: VerificationObligationStatus;
    previousOwnerResponse: VerificationOwnerResponse | null;
    newOwnerResponse: VerificationOwnerResponse | null;
    notes: string | null;
  }) {
    return {
      id: params.id,
      obligation: params.obligation,
      changedByUser: params.changedByUser,
      actionType: params.actionType,
      previousStatus: params.previousStatus,
      newStatus: params.newStatus,
      previousOwnerResponse: params.previousOwnerResponse,
      newOwnerResponse: params.newOwnerResponse,
      notes: params.notes,
      createdAt: new Date(),
    } as VerificationObligationHistory;
  }

  function buildState() {
    users = [
      createUser({
        id: '1',
        email: 'admin@vera.local',
        fullName: 'Admin Vera',
        isAdmin: true,
      }),
      createUser({
        id: '2',
        email: 'owner@vera.local',
        fullName: 'Owner Vera',
        isAdmin: false,
      }),
      createUser({
        id: '3',
        email: 'outside@vera.local',
        fullName: 'Outside Vera',
        isAdmin: false,
      }),
    ];

    primaryVehicle = {
      id: '1',
      plate: '55AB5C',
      serialNiv: '1HGCM82633A004352',
      engineNumber: 'ENGINE-001',
      unitType: 'TRACTOCAMION',
      regime: VehicleRegime.FEDERAL,
      scheduleMarkerAuto: '5',
      scheduleMarkerOverride: null,
      scheduleMarkerEffective: '5',
      isActive: true,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: [],
      userAccesses: [
        {
          id: '501',
          user: users[1],
          vehicle: null as unknown as Vehicle,
          accessType: UserVehicleAccessType.OWNER_PORTAL,
          isActive: true,
          grantedByUser: users[0],
          grantedAt: new Date('2026-01-01T10:00:00.000Z'),
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as UserVehicleAccess,
      ],
      verificationEvents: [],
      verificationObligations: [],
      documents: [],
    } as Vehicle;

    primaryVehicle.userAccesses[0].vehicle = primaryVehicle;

    events = [
      createEvent({
        id: '1',
        vehicle: primaryVehicle,
        verificationType: VerificationType.PHYSICAL_MECHANICAL,
        eventDate: '2026-03-15',
        validUntil: '2026-12-31',
        certificateFolio: 'PHYS-001',
      }),
      createEvent({
        id: '2',
        vehicle: primaryVehicle,
        verificationType: VerificationType.EMISSIONS,
        eventDate: '2026-04-01',
        validUntil: '2026-06-30',
        certificateFolio: 'EMIS-001',
      }),
    ];
    primaryVehicle.verificationEvents = events;

    centers = [
      createCenter({
        id: '20',
        code: 'MTY-001',
        name: 'Centro Operativo Norte',
      }),
    ];

    obligations = [
      createObligation({
        id: '100',
        vehicle: primaryVehicle,
        verificationType: VerificationType.PHYSICAL_MECHANICAL,
        ownerUser: users[1],
      }),
    ];
    primaryVehicle.verificationObligations = obligations;

    historyEntries = [
      createHistoryEntry({
        id: '900',
        obligation: obligations[0],
        changedByUser: users[0],
        actionType: VerificationObligationHistoryAction.CREATED,
        previousStatus: null,
        newStatus: VerificationObligationStatus.PENDING,
        previousOwnerResponse: null,
        newOwnerResponse: null,
        notes: 'Creada por fixture de pruebas.',
      }),
    ];
    obligations[0].historyEntries = [...historyEntries];
  }

  function nextId(collection: Array<{ id: string }>) {
    return `${collection.length + 1_000}`;
  }

  function sortHistory(obligation: VerificationObligation) {
    obligation.historyEntries.sort(
      (left, right) => left.createdAt.getTime() - right.createdAt.getTime(),
    );
  }

  beforeEach(async () => {
    buildState();

    const userRepository = {
      findOne: jest.fn(
        async (options: { where?: { email?: string; id?: string; isActive?: boolean } }) => {
          const email = options.where?.email;
          const id = options.where?.id;
          const isActive = options.where?.isActive;

          return (
            users.find((user) => {
              if (email && user.email !== email) {
                return false;
              }

              if (id && user.id !== id) {
                return false;
              }

              if (isActive !== undefined && user.isActive !== isActive) {
                return false;
              }

              return true;
            }) ?? null
          );
        },
      ),
      findOneBy: jest.fn(async (where: { id?: string }) => {
        return users.find((user) => user.id === where.id) ?? null;
      }),
      save: jest.fn(async (user: User) => {
        user.updatedAt = new Date();
        return user;
      }),
    };

    const vehicleRepository = {
      findOne: jest.fn(async (options: { where?: { id?: string } }) => {
        return options.where?.id === primaryVehicle.id ? primaryVehicle : null;
      }),
      findOneBy: jest.fn(async (where: { id?: string }) => {
        return where.id === primaryVehicle.id ? primaryVehicle : null;
      }),
    };

    const userVehicleAccessRepository = {
      count: jest.fn(
        async (options: {
          where?: { user?: { id?: string }; vehicle?: { id?: string }; isActive?: boolean };
        }) => {
          const userId = options.where?.user?.id;
          const vehicleId = options.where?.vehicle?.id;
          const isActive = options.where?.isActive;

          if (userId === '2' && vehicleId === primaryVehicle.id && isActive === true) {
            return 1;
          }

          return 0;
        },
      ),
    };

    const centerRepository = {
      findOneBy: jest.fn(async (where: { id?: string }) => {
        return centers.find((center) => center.id === where.id) ?? null;
      }),
    };

    const obligationHistoryRepository = {
      create: jest.fn(
        (payload: Partial<VerificationObligationHistory>) =>
          ({
            id: payload.id ?? nextId(historyEntries),
            createdAt: payload.createdAt ?? new Date(),
            ...payload,
          }) as VerificationObligationHistory,
      ),
      save: jest.fn(async (entry: VerificationObligationHistory) => {
        const normalizedEntry = {
          ...entry,
          id: entry.id ?? nextId(historyEntries),
          createdAt: entry.createdAt ?? new Date(),
        } as VerificationObligationHistory;

        historyEntries.push(normalizedEntry);
        normalizedEntry.obligation.historyEntries.push(normalizedEntry);
        sortHistory(normalizedEntry.obligation);
        return normalizedEntry;
      }),
    };

    const obligationRepository = {
      findOne: jest.fn(
        async (options: { where?: { id?: string }; relations?: unknown; order?: unknown }) => {
          return obligations.find((obligation) => obligation.id === options.where?.id) ?? null;
        },
      ),
      save: jest.fn(async (obligation: VerificationObligation) => {
        const current = obligations.find((item) => item.id === obligation.id);
        if (!current) {
          obligations.push(obligation);
          primaryVehicle.verificationObligations.push(obligation);
          return obligation;
        }

        Object.assign(current, obligation, { updatedAt: new Date() });
        return current;
      }),
    };

    const eventRepository = {
      create: jest.fn(
        (payload: Partial<VerificationEvent>) =>
          ({
            id: nextId(events),
            linkedObligations: [],
            verificationObligations: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            sourceDocument: null,
            observations: null,
            certificateFolio: null,
            center: null,
            ...payload,
          }) as VerificationEvent,
      ),
      save: jest.fn(async (event: VerificationEvent) => {
        const savedEvent = {
          ...event,
          id: event.id ?? nextId(events),
          createdAt: event.createdAt ?? new Date(),
          updatedAt: new Date(),
        } as VerificationEvent;
        events.push(savedEvent);
        savedEvent.vehicle.verificationEvents.push(savedEvent);
        return savedEvent;
      }),
      findOne: jest.fn(async (options: { where?: { id?: string } }) => {
        return events.find((event) => event.id === options.where?.id) ?? null;
      }),
      manager: {
        transaction: async (
          callback: (manager: {
            getRepository: (entity: unknown) => unknown;
          }) => Promise<unknown>,
        ) =>
          callback({
            getRepository: (entity: unknown) => {
              if (entity === Vehicle) {
                return vehicleRepository;
              }

              if (entity === VerificationCenter) {
                return centerRepository;
              }

              if (entity === VerificationEvent) {
                return eventRepository;
              }

              if (entity === VerificationObligation) {
                return obligationRepository;
              }

              if (entity === VerificationObligationHistory) {
                return obligationHistoryRepository;
              }

              if (entity === User) {
                return userRepository;
              }

              throw new Error('Unexpected repository requested in test transaction.');
            },
          }),
      },
    };

    const scheduleRuleRepository = {
      find: jest.fn(async (options: { where?: { verificationType?: VerificationType } }) => {
        if (options.where?.verificationType === VerificationType.PHYSICAL_MECHANICAL) {
          return [
            {
              id: '10',
              regime: VehicleRegime.FEDERAL,
              schedulePosition: 3,
              scheduleMarker: '5',
              verificationType: VerificationType.PHYSICAL_MECHANICAL,
              windowSequence: 1,
              windowStartMonth: 1,
              windowEndMonth: 12,
              windowLabel: 'Anual',
              isActive: true,
              notes: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            } as VerificationScheduleRule,
          ];
        }

        return [
          {
            id: '11',
            regime: VehicleRegime.FEDERAL,
            schedulePosition: 3,
            scheduleMarker: '5',
            verificationType: VerificationType.EMISSIONS,
            windowSequence: 1,
            windowStartMonth: 1,
            windowEndMonth: 6,
            windowLabel: 'Enero-Junio',
            isActive: true,
            notes: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as VerificationScheduleRule,
        ];
      }),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthController, VerificationsController],
      providers: [
        AuthService,
        VerificationsService,
        JwtAuthGuard,
        AdminGuard,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: getRepositoryToken(Vehicle),
          useValue: vehicleRepository,
        },
        {
          provide: getRepositoryToken(UserVehicleAccess),
          useValue: userVehicleAccessRepository,
        },
        {
          provide: getRepositoryToken(VerificationCenter),
          useValue: centerRepository,
        },
        {
          provide: getRepositoryToken(VerificationEvent),
          useValue: eventRepository,
        },
        {
          provide: getRepositoryToken(VerificationObligation),
          useValue: obligationRepository,
        },
        {
          provide: getRepositoryToken(VerificationObligationHistory),
          useValue: obligationHistoryRepository,
        },
        {
          provide: getRepositoryToken(VerificationScheduleRule),
          useValue: scheduleRuleRepository,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  async function login(email: string) {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'Secret123!',
      })
      .expect(201);

    return response.body.accessToken as string;
  }

  it('rejects verifications routes without a bearer token', async () => {
    await request(app.getHttpServer())
      .get('/verifications/vehicles/1/status')
      .expect(401);
  });

  it('allows an assigned owner to read the regulatory status of their vehicle', async () => {
    const token = await login('owner@vera.local');

    const response = await request(app.getHttpServer())
      .get('/verifications/vehicles/1/status')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.vehicle).toMatchObject({
      id: '1',
      plate: '55AB5C',
      regime: 'FEDERAL',
    });
  });

  it('blocks a user without access from reading another vehicle', async () => {
    const token = await login('outside@vera.local');

    await request(app.getHttpServer())
      .get('/verifications/vehicles/1/status')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('blocks a non-admin user from generating obligations', async () => {
    const token = await login('owner@vera.local');

    await request(app.getHttpServer())
      .post('/verifications/obligations/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        referenceDate: '2026-05-12',
      })
      .expect(403);
  });

  it('validates schedule rule payloads before they reach the service', async () => {
    const token = await login('admin@vera.local');

    await request(app.getHttpServer())
      .post('/verifications/schedule-rules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        regime: 'FEDERAL',
        schedulePosition: 3,
        scheduleMarker: 'AB',
        verificationType: 'PHYSICAL_MECHANICAL',
        windowStartMonth: 1,
        windowEndMonth: 12,
        windowLabel: 'Anual',
      })
      .expect(400);
  });

  it('allows the owner flow from response to admin scheduling and completion', async () => {
    const ownerToken = await login('owner@vera.local');
    const adminToken = await login('admin@vera.local');

    const responseStep = await request(app.getHttpServer())
      .post('/verifications/obligations/100/respond')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        ownerResponse: VerificationOwnerResponse.CONFIRMED,
        notes: 'La unidad puede asistir esta semana.',
      })
      .expect(201);

    expect(responseStep.body).toMatchObject({
      id: '100',
      status: VerificationObligationStatus.OWNER_CONFIRMED,
      ownerResponse: VerificationOwnerResponse.CONFIRMED,
    });
    expect(responseStep.body.history).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionType: VerificationObligationHistoryAction.OWNER_RESPONSE,
          newStatus: VerificationObligationStatus.OWNER_CONFIRMED,
          newOwnerResponse: VerificationOwnerResponse.CONFIRMED,
        }),
      ]),
    );

    const scheduleStep = await request(app.getHttpServer())
      .post('/verifications/obligations/100/schedule')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        adminUserId: '1',
        scheduledCenterId: '20',
        scheduledFor: '2026-06-10T09:30:00.000Z',
        notes: 'Cita asignada por administracion.',
      })
      .expect(201);

    expect(scheduleStep.body).toMatchObject({
      id: '100',
      status: VerificationObligationStatus.SCHEDULED,
      scheduledCenter: {
        id: '20',
        code: 'MTY-001',
      },
      adminUser: {
        id: '1',
        isAdmin: true,
      },
    });
    expect(scheduleStep.body.scheduledFor).toContain('2026-06-10T09:30:00.000Z');
    expect(scheduleStep.body.history).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionType: VerificationObligationHistoryAction.SCHEDULED,
          newStatus: VerificationObligationStatus.SCHEDULED,
        }),
      ]),
    );

    const completionStep = await request(app.getHttpServer())
      .post('/verifications/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        vehicleId: '1',
        centerId: '20',
        verificationType: VerificationType.PHYSICAL_MECHANICAL,
        eventDate: '2026-06-10',
        validUntil: '2027-06-30',
        resultStatus: VerificationResultStatus.PASSED,
        certificateFolio: 'PHYS-2026-200',
        verificationObligationId: '100',
        adminUserId: '1',
        completionNotes: 'Evento registrado y obligacion cerrada.',
      })
      .expect(201);

    expect(completionStep.body).toMatchObject({
      verificationType: VerificationType.PHYSICAL_MECHANICAL,
      completedObligationId: '100',
      center: {
        id: '20',
        code: 'MTY-001',
      },
    });

    const obligationAfterCompletion = await request(app.getHttpServer())
      .get('/verifications/obligations/100')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(obligationAfterCompletion.body).toMatchObject({
      id: '100',
      status: VerificationObligationStatus.COMPLETED,
      verificationEvent: {
        verificationType: VerificationType.PHYSICAL_MECHANICAL,
        certificateFolio: 'PHYS-2026-200',
      },
    });
    expect(obligationAfterCompletion.body.history).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionType: VerificationObligationHistoryAction.COMPLETED,
          newStatus: VerificationObligationStatus.COMPLETED,
        }),
      ]),
    );
  });

  it('prevents a non-admin owner from responding on behalf of another user', async () => {
    const ownerToken = await login('owner@vera.local');

    await request(app.getHttpServer())
      .post('/verifications/obligations/100/respond')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        ownerUserId: '3',
        ownerResponse: VerificationOwnerResponse.CONFIRMED,
      })
      .expect(403);
  });
});
