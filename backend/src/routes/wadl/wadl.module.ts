import { Module } from '@nestjs/common';
import { WadlParameterService } from './wadl-parameter.service';
import { WadlRepresentationService } from './wadl-representation.service';
import { WadlRequestService } from './wadl-request.service';
import { WadlController } from './wadl.controller';
import { WadlService } from './wadl.service';

@Module({
	imports: [],
	controllers: [WadlController],
	providers: [
		WadlService,
		WadlParameterService,
		WadlRequestService,
		WadlRepresentationService
	],
})
export class WadlModule {}
