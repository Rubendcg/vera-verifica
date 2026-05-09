import { Injectable } from '@nestjs/common';
import { ModuleSummary } from '../../common/module-summary.interface';

@Injectable()
export class VehiclesService {
  getModuleSummary(): ModuleSummary {
    return {
      key: 'vehicles',
      route: '/vehicles',
      phase: 1,
      purpose: 'Administra el padron vehicular, sus regimenes y las relaciones con sus responsables.',
      tables: ['vehicles', 'vehicle_party_roles', 'user_vehicle_access'],
    };
  }
}
