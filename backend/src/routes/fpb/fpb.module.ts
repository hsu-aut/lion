import { FpbService } from './fpb.service';
import { FpbController } from './fpb.controller';
import { Module } from '@nestjs/common';

@Module({
	imports: [],
	controllers: [
		FpbController,],
	providers: [
		FpbService,],
})
export class FpbModule { }
