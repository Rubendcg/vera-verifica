import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
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
    TypeOrmModule.forFeature([
      User,
      Vehicle,
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
