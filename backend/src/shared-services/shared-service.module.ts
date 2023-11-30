import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { GraphOperationService } from './graph-operation.service';
import { GraphDbModelService } from './graphdb-model.service';
import { RepositoryService } from './repository.service';
import { SparqlService } from './sparql.service';
import { ModelService } from './model.service';
import { UsersModule } from '../users/users.module';
import { CurrentUserService } from './current-user.service';

@Global()
@Module({
	imports: [
	HttpModule,
	UsersModule,
	],
	controllers: [],
	providers: [
	GraphOperationService,
	GraphDbModelService,
	RepositoryService,
	SparqlService,
	ModelService,
	CurrentUserService
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
