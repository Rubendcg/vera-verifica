import { Injectable } from '@nestjs/common';
import { ModuleSummary } from '../../common/module-summary.interface';

@Injectable()
export class CapacityService {
  getModuleSummary(): ModuleSummary {
    return {
      key: 'capacity',
      route: '/capacity',
      phase: 3,
      purpose: 'Mide capacidad diaria, calendario habil y sesiones para analizar saturacion.',
      tables: [
        'verification_sessions',
        'verification_center_capacity_daily',
        'calendar_business_days',
      ],
    };
  }
}
