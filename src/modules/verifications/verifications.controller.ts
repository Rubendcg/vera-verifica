import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequireAdmin } from '../auth/decorators/require-admin.decorator';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateVerificationCenterDto } from './dto/create-verification-center.dto';
import { CreateVerificationEventDto } from './dto/create-verification-event.dto';
import { CreateVerificationObligationDto } from './dto/create-verification-obligation.dto';
import { CreateVerificationScheduleRuleDto } from './dto/create-verification-schedule-rule.dto';
import { GenerateVerificationObligationsDto } from './dto/generate-verification-obligations.dto';
import { QueryVerificationCentersDto } from './dto/query-verification-centers.dto';
import { QueryVerificationEventsDto } from './dto/query-verification-events.dto';
import { QueryVerificationObligationsDto } from './dto/query-verification-obligations.dto';
import { QueryVerificationScheduleRulesDto } from './dto/query-verification-schedule-rules.dto';
import { RespondVerificationObligationDto } from './dto/respond-verification-obligation.dto';
import { ScheduleVerificationObligationDto } from './dto/schedule-verification-obligation.dto';
import { VerificationsService } from './verifications.service';

@UseGuards(JwtAuthGuard)
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
  getVehicleRegulatoryStatus(
    @Param('vehicleId') vehicleId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.verificationsService.getVehicleRegulatoryStatus(vehicleId, currentUser);
  }

  @Get('centers')
  listCenters(@Query() query: QueryVerificationCentersDto) {
    return this.verificationsService.listCenters(query);
  }

  @RequireAdmin()
  @UseGuards(AdminGuard)
  @Post('centers')
  createCenter(@Body() dto: CreateVerificationCenterDto) {
    return this.verificationsService.createCenter(dto);
  }

  @Get('schedule-rules')
  listScheduleRules(@Query() query: QueryVerificationScheduleRulesDto) {
    return this.verificationsService.listScheduleRules(query);
  }

  @RequireAdmin()
  @UseGuards(AdminGuard)
  @Post('schedule-rules')
  createScheduleRule(@Body() dto: CreateVerificationScheduleRuleDto) {
    return this.verificationsService.createScheduleRule(dto);
  }

  @Get('events')
  listEvents(
    @Query() query: QueryVerificationEventsDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.verificationsService.listEvents(query, currentUser);
  }

  @Get('events/:id')
  getEventById(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.verificationsService.getEventById(id, currentUser);
  }

  @RequireAdmin()
  @UseGuards(AdminGuard)
  @Post('events')
  createEvent(@Body() dto: CreateVerificationEventDto) {
    return this.verificationsService.createEvent(dto);
  }

  @Get('obligations')
  listObligations(
    @Query() query: QueryVerificationObligationsDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.verificationsService.listObligations(query, currentUser);
  }

  @Get('obligations/:id')
  getObligationById(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.verificationsService.getObligationById(id, currentUser);
  }

  @RequireAdmin()
  @UseGuards(AdminGuard)
  @Post('obligations')
  createObligation(@Body() dto: CreateVerificationObligationDto) {
    return this.verificationsService.createObligation(dto);
  }

  @RequireAdmin()
  @UseGuards(AdminGuard)
  @Post('obligations/generate')
  generateObligations(@Body() dto: GenerateVerificationObligationsDto) {
    return this.verificationsService.generateObligations(dto);
  }

  @Post('obligations/:id/respond')
  respondToObligation(
    @Param('id') id: string,
    @Body() dto: RespondVerificationObligationDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.verificationsService.respondToObligation(id, dto, currentUser);
  }

  @RequireAdmin()
  @UseGuards(AdminGuard)
  @Post('obligations/:id/schedule')
  scheduleObligation(
    @Param('id') id: string,
    @Body() dto: ScheduleVerificationObligationDto,
  ) {
    return this.verificationsService.scheduleObligation(id, dto);
  }
}
