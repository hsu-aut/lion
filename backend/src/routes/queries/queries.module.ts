import { Module } from '@nestjs/common';
import { QuerieController } from './queries.controller';
import {SharedServiceModule} from '../../shared-services/shared-service.module';
@Module({
	imports: [],
	controllers: [
		QuerieController
	],
	providers: [SharedServiceModule
	
	],
})
export class QueriesModule {}
