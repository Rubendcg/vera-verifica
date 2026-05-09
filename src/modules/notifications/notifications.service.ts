import { Injectable } from '@nestjs/common';
import { ModuleSummary } from '../../common/module-summary.interface';

@Injectable()
export class NotificationsService {
  getModuleSummary(): ModuleSummary {
    return {
      key: 'notifications',
      route: '/notifications',
      phase: 2,
      purpose: 'Gestiona reglas, destinatarios, plantillas, lotes y trazabilidad de envios.',
      tables: [
        'report_recipients',
        'notification_rules',
        'message_templates',
        'notification_batches',
        'notification_batch_items',
        'notification_log',
      ],
    };
  }
}
