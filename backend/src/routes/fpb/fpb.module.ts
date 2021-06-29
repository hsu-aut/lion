import { FpbService } from './fpb.service';
import { FpbController } from './fpb.controller';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

@Module({
	imports: [
		MulterModule.register({
			dest: FpbService.getFpbTempDirectory(),
		})
	],
	controllers: [
		FpbController,],
	providers: [
		FpbService,],
})
export class FpbModule {}