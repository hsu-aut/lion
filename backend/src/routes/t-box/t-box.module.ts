import { Module } from '@nestjs/common';
import { SharedServiceModule } from '../../shared-services/shared-service.module';
import { TBoxController } from './t-box.controller';
import { HttpModule } from '@nestjs/axios';
import { TBoxService } from './t-box.service';

@Module({
	imports: [
		HttpModule,
		SharedServiceModule
	],
	controllers: [
		TBoxController,
	],
	providers: [
		TBoxService,
	],
})
export class TBoxModule {}