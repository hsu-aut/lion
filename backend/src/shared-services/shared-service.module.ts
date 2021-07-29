import { Global, HttpModule, Module } from '@nestjs/common';
import { GraphOperationService } from './graph-operation.service';
import { GraphDbModelService } from './graphdb-model.service';
import { RepositoryService } from './repository.service';

@Global()
@Module({
	imports: [
		HttpModule,
	],
	controllers: [],
	providers: [
		GraphDbModelService,
		RepositoryService,
		GraphOperationService
	],
	exports: [
		GraphDbModelService,
		RepositoryService,
		GraphOperationService
	]
})
export class SharedServiceModule {}
