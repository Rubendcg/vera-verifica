import { Injectable } from '@nestjs/common';
import { ModuleSummary } from '../../common/module-summary.interface';

@Injectable()
export class ReportsService {
  getModuleSummary(): ModuleSummary {
    return {
      key: 'reports',
      route: '/reports',
      phase: 2,
      purpose: 'Expone reportes operativos por cliente, vencimiento, regimen y estado de cumplimiento.',
      tables: ['vw_vehicle_verification_status', 'vw_pending_verifications_by_client'],
    };
  }
}
