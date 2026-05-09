import { Injectable } from '@nestjs/common';
import { ModuleSummary } from '../../common/module-summary.interface';

@Injectable()
export class PartiesService {
  getModuleSummary(): ModuleSummary {
    return {
      key: 'parties',
      route: '/parties',
      phase: 1,
      purpose: 'Gestiona personas, empresas, clientes y contactos relacionados con los vehiculos.',
      tables: ['parties', 'party_contacts'],
    };
  }
}
