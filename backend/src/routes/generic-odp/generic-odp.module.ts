import { Module } from '@nestjs/common';
import { GenericOdpController } from './generic-odp.controller';
import { GenericOdpService } from './generic-odp.service';
import { SparqlTemplateService } from './sparql-template.service';

@Module({
	imports: [

	],
	controllers: [
		GenericOdpController,
    ],
	providers: [
		GenericOdpService,
		SparqlTemplateService,
	],
})
export class GenericOdpModule {}