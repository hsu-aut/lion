import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OdpStore } from './odp-store.service';
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
		OdpService,
		OdpStore
	],
})
export class OdpModule {}
