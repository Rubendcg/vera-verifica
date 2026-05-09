import { Injectable } from '@nestjs/common';
import { ModuleSummary } from '../../common/module-summary.interface';

@Injectable()
export class UsersService {
  getModuleSummary(): ModuleSummary {
    return {
      key: 'users',
      route: '/users',
      phase: 1,
      purpose: 'Administra los usuarios del sistema y su relacion con personas y empresas.',
      tables: ['users'],
    };
  }
}
