import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
