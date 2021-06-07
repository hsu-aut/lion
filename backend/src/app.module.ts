import { Module } from '@nestjs/common';
import { BackendController } from './app.controller';
import { BackendService } from './app.service';
import { FpbModule } from './routes/fpb/fpb.module';

@Module({
	imports: [
		FpbModule
	],
	controllers: [BackendController],
	providers: [BackendService],
})
export class BackendModule {}
