import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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
import { VerificationsService } from './verifications.service';

@Controller('verifications')
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  @Get()
  getModuleSummary() {
    return this.verificationsService.getModuleSummary();
  }

  @Get('catalogs')
  getCatalogs() {
    return this.verificationsService.getCatalogs();
  }

  @Get('vehicles/:vehicleId/status')
  getVehicleRegulatoryStatus(@Param('vehicleId') vehicleId: string) {
    return this.verificationsService.getVehicleRegulatoryStatus(vehicleId);
  }

  @Get('centers')
  listCenters(@Query() query: QueryVerificationCentersDto) {
    return this.verificationsService.listCenters(query);
  }

  @Post('centers')
  createCenter(@Body() dto: CreateVerificationCenterDto) {
    return this.verificationsService.createCenter(dto);
  }

  @Get('schedule-rules')
  listScheduleRules(@Query() query: QueryVerificationScheduleRulesDto) {
    return this.verificationsService.listScheduleRules(query);
  }

  @Post('schedule-rules')
  createScheduleRule(@Body() dto: CreateVerificationScheduleRuleDto) {
    return this.verificationsService.createScheduleRule(dto);
  }

  @Get('events')
  listEvents(@Query() query: QueryVerificationEventsDto) {
    return this.verificationsService.listEvents(query);
  }

  @Get('events/:id')
  getEventById(@Param('id') id: string) {
    return this.verificationsService.getEventById(id);
  }

  @Post('events')
  createEvent(@Body() dto: CreateVerificationEventDto) {
    return this.verificationsService.createEvent(dto);
  }

  @Get('obligations')
  listObligations(@Query() query: QueryVerificationObligationsDto) {
    return this.verificationsService.listObligations(query);
  }

  @Get('obligations/:id')
  getObligationById(@Param('id') id: string) {
    return this.verificationsService.getObligationById(id);
  }

  @Post('obligations')
  createObligation(@Body() dto: CreateVerificationObligationDto) {
    return this.verificationsService.createObligation(dto);
  }

  @Post('obligations/:id/respond')
  respondToObligation(
    @Param('id') id: string,
    @Body() dto: RespondVerificationObligationDto,
  ) {
    return this.verificationsService.respondToObligation(id, dto);
  }

  @Post('obligations/:id/schedule')
  scheduleObligation(
    @Param('id') id: string,
    @Body() dto: ScheduleVerificationObligationDto,
  ) {
    return this.verificationsService.scheduleObligation(id, dto);
  }
}
