import { Module } from '@nestjs/common';
import { GenericOdpController } from './generic-odp.controller';
import { GenericOdpService } from './generic-odp.service';

@Module({
	imports: [

	],
	controllers: [
		GenericOdpController,
    ],
	providers: [
		GenericOdpService,
	],
})
export class GenericOdpModule {}