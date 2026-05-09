import { Controller, Get } from '@nestjs/common';
import { VerificationsService } from './verifications.service';

@Controller('verifications')
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  @Get()
  getModuleSummary() {
    return this.verificationsService.getModuleSummary();
  }
}
