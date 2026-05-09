import { Injectable } from '@nestjs/common';
import { ModuleSummary } from '../../common/module-summary.interface';

@Injectable()
export class ServiceOrdersService {
  getModuleSummary(): ModuleSummary {
    return {
      key: 'service-orders',
      route: '/service-orders',
      phase: 4,
      purpose: 'Registra los servicios realizados y su detalle economico antes de convertirse en cobranza.',
      tables: ['service_orders', 'service_order_items'],
    };
  }
}
