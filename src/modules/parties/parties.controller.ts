import { Controller, Get } from '@nestjs/common';
import { PartiesService } from './parties.service';

@Controller('parties')
export class PartiesController {
  constructor(private readonly partiesService: PartiesService) {}

  @Get()
  getModuleSummary() {
    return this.partiesService.getModuleSummary();
  }
}
