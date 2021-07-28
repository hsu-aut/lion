import { FpbService } from './fpb.service';
import { FpbController } from './fpb.controller';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FpbMappingService } from './fpb-mapping.service';
import { SharedServiceModule } from '../../shared-services/shared-service.module';

@Module({
	imports: [
		MulterModule.register({
			dest: FpbService.getFpbUploadDirectory(),
		}),
		SharedServiceModule
	],
	controllers: [
		FpbController,],
	providers: [
		FpbService,
		FpbMappingService
	],
})
export class FpbModule {}