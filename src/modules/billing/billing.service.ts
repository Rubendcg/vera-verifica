import { Injectable } from '@nestjs/common';
import { ModuleSummary } from '../../common/module-summary.interface';

@Injectable()
export class BillingService {
  getModuleSummary(): ModuleSummary {
    return {
      key: 'billing',
      route: '/billing',
      phase: 4,
      purpose: 'Administra cuentas por cobrar, documentos, parcialidades y aplicaciones de pago.',
      tables: [
        'client_accounts',
        'receivable_documents',
        'receivable_installments',
        'payment_transactions',
        'payment_applications',
      ],
    };
  }
}
