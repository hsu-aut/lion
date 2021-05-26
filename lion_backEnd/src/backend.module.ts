import { Module } from '@nestjs/common';
import { BackendController } from './backend.controller';
import { BackendService } from './backend.service';

@Module({
  imports: [],
  controllers: [BackendController],
  providers: [BackendService],
})
export class BackendModule {}
