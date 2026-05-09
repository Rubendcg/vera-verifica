import { Injectable } from '@nestjs/common';
import { ModuleSummary } from '../../common/module-summary.interface';

@Injectable()
export class DocumentsService {
  getModuleSummary(): ModuleSummary {
    return {
      key: 'documents',
      route: '/documents',
      phase: 1,
      purpose: 'Administra tarjetas, constancias y archivos PDF asociados al expediente vehicular.',
      tables: ['documents', 'document_files'],
    };
  }
}
