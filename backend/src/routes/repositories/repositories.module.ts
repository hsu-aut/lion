import { Module } from '@nestjs/common';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';

@Module({
	imports: [],
	controllers: [
			RepositoriesController
	],
	providers: [
			RepositoriesService
	],
})
export class RepositoriesModule {}
