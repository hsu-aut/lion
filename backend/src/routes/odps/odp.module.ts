import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OdpController } from './odp.controller';
import { OdpService } from './odp.service';


@Module({
	imports: [
		HttpModule
	],
	controllers: [
		OdpController
	],
	providers: [
		OdpService
	],
})
export class OdpModule {}
