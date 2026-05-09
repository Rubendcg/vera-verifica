import { Injectable } from '@nestjs/common';
import { ModuleSummary } from '../../common/module-summary.interface';

@Injectable()
export class VerificationsService {
  getModuleSummary(): ModuleSummary {
    return {
      key: 'verifications',
      route: '/verifications',
      phase: 1,
      purpose: 'Controla eventos de verificacion, calendario por regimen y estado regulatorio.',
      tables: ['verification_events', 'verification_schedule_rules', 'verification_centers'],
    };
  }
}
