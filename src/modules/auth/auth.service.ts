import { Injectable } from '@nestjs/common';
import { ModuleSummary } from '../../common/module-summary.interface';

@Injectable()
export class AuthService {
  getModuleSummary(): ModuleSummary {
    return {
      key: 'auth',
      route: '/auth',
      phase: 1,
      purpose: 'Controla autenticacion, sesion y permisos base para administradores y propietarios.',
      tables: ['users'],
    };
  }
}
