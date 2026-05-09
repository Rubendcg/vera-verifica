import { Injectable } from '@nestjs/common';
import { ModuleSummary } from '../../common/module-summary.interface';

@Injectable()
export class AnalyticsService {
  getModuleSummary(): ModuleSummary {
    return {
      key: 'analytics',
      route: '/analytics',
      phase: 3,
      purpose: 'Consolida historia, snapshots, calidad del dato y demanda operativa.',
      tables: ['vehicle_status_history', 'daily_vehicle_status_snapshot', 'data_quality_issues'],
    };
  }
}
