import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getOverview() {
    return {
      name: 'Vera',
      type: 'platform',
      status: 'scaffolded',
      description:
        'Plataforma para control de verificaciones, documentos, reportes, notificaciones, analitica y cobranza.',
      modules: [
        'auth',
        'users',
        'parties',
        'vehicles',
        'verifications',
        'documents',
        'reports',
        'notifications',
        'analytics',
        'capacity',
        'service-orders',
        'billing',
        'collections',
      ],
      docsPath: '/docs',
    };
  }
}
