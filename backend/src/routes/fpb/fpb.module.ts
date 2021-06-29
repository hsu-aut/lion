import { FpbService } from './fpb.service';
import { FpbController } from './fpb.controller';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FpbMappingService } from './fpb-mapping.service';
import { GraphDbModelModule } from '../../shared-services/graphdb-model/graphdb-model.module';

@Module({
	imports: [
		MulterModule.register({
			dest: FpbService.getFpbUploadDirectory(),
		}),
		GraphDbModelModule
	],
	controllers: [
		FpbController,],
	providers: [
		FpbService,
		FpbMappingService
	],
})
export class FpbModule {}