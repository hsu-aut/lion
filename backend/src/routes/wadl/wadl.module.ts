import { Module } from '@nestjs/common';
import { WadlParameterService } from './wadl-parameter.service';
import { WadlRepresentationService } from './wadl-representation.service';
import { WadlController } from './wadl.controller';
import { WadlService } from './wadl.service';

@Module({
	imports: [],
	controllers: [WadlController],
	providers: [
		WadlService,
		WadlParameterService,
		WadlRepresentationService
	],
})
export class WadlModule {}
