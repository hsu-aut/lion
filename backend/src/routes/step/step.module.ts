import { Module } from '@nestjs/common';
import { StepController } from './step.controller';
import { StepService } from './step.service';

@Module({
	imports: [],
	controllers: [
		StepController
	],
	providers: [
		StepService
	],
})
export class StepModule {}