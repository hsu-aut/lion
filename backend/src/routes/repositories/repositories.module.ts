import { Module } from '@nestjs/common';
import { SharedServiceModule } from '../../shared-services/shared-service.module';
import { RepositoriesController } from './repositories.controller';


@Module({
	imports: [SharedServiceModule],
	controllers: [
		RepositoriesController
	],
	providers: [
		
	],
})
export class RepositoriesModule {}
