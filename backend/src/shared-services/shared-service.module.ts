import { Global, HttpModule, Module } from '@nestjs/common';
import { GraphDbModelService } from './graphdb-model.service';
import { GraphDbRepositoryService } from './graphdb-repository.service';

@Global()
@Module({
	imports: [
		HttpModule,
	],
	controllers: [],
	providers: [
		GraphDbModelService,
		GraphDbRepositoryService
	],
	exports: [
		GraphDbModelService,
		GraphDbRepositoryService
	]
})
export class SharedServiceModule {}
