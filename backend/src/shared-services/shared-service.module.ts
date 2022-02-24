import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { GraphOperationService } from './graph-operation.service';
import { GraphDbModelService } from './graphdb-model.service';
import { RepositoryService } from './repository.service';
import { SparqlService } from './sparql.service';
import { ModelService } from './model.service';

@Global()
@Module({
	imports: [
		HttpModule,
	],
	controllers: [],
	providers: [
		GraphOperationService,
		GraphDbModelService,
		RepositoryService,
		SparqlService,
		ModelService
	],
	exports: [
		GraphOperationService,
		GraphDbModelService,
		RepositoryService,
		SparqlService,
		ModelService
	]
})
export class SharedServiceModule {}
