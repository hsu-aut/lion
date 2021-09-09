import { Module } from '@nestjs/common';
import { SharedServiceModule } from '../../shared-services/shared-service.module';

import { GraphsController } from './graphs.controller';

@Module({
	imports: [],
	controllers: [
		GraphsController
	],
	providers: [
		SharedServiceModule
	]
})
export class GraphsModule { }
