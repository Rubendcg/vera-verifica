import { Injectable } from '@nestjs/common';
import { ModuleSummary } from '../../common/module-summary.interface';

@Injectable()
export class CollectionsService {
  getModuleSummary(): ModuleSummary {
    return {
      key: 'collections',
      route: '/collections',
      phase: 4,
      purpose: 'Da seguimiento a saldo, movimientos de cuenta y recuperacion de cartera.',
      tables: ['account_movements', 'vw_client_account_balance', 'vw_client_receivables_aging'],
    };
  }
}
