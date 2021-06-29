import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FpbModule } from './routes/fpb/fpb.module';
import { StepModule } from './routes/step/step.module';

@Module({
	imports: [
		FpbModule,
		StepModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
