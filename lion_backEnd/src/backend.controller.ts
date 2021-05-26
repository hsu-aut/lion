import { Controller, Get } from '@nestjs/common';
import { BackendService } from './backend.service';

@Controller()
export class BackendController {
  constructor(private readonly backendService: BackendService) {}

  @Get()
  getHello(): string {
    return this.backendService.getHello();
  }
}
