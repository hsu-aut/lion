import { Module } from '@nestjs/common';
import { BackendController } from './app.controller';
import { BackendService } from './app.service';
import { FpbModule } from './routes/fpb/fpb.module';
import { StepModule } from './routes/step/step.module';

@Module({
	imports: [
		// FpbModule,
		StepModule
	],
	controllers: [BackendController],
	providers: [BackendService],
})
export class BackendModule {}
