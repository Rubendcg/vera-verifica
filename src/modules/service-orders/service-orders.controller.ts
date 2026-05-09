import { Controller, Get } from '@nestjs/common';
import { ServiceOrdersService } from './service-orders.service';

@Controller('service-orders')
export class ServiceOrdersController {
  constructor(private readonly serviceOrdersService: ServiceOrdersService) {}

  @Get()
  getModuleSummary() {
    return this.serviceOrdersService.getModuleSummary();
  }
}
