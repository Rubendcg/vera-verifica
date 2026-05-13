import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';
import { UserVehicleAccess } from '../vehicles/entities/user-vehicle-access.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { VerificationCenter } from './entities/verification-center.entity';
import { VerificationEvent } from './entities/verification-event.entity';
import { VerificationObligationHistory } from './entities/verification-obligation-history.entity';
import { VerificationObligation } from './entities/verification-obligation.entity';
import { VerificationScheduleRule } from './entities/verification-schedule-rule.entity';
import { VerificationsController } from './verifications.controller';
import { VerificationsService } from './verifications.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      User,
      Vehicle,
      UserVehicleAccess,
      VerificationCenter,
      VerificationEvent,
      VerificationObligation,
      VerificationObligationHistory,
      VerificationScheduleRule,
    ]),
  ],
  controllers: [VerificationsController],
  providers: [VerificationsService],
  exports: [VerificationsService],
})
export class VerificationsModule {}
