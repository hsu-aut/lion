import { Module } from '@nestjs/common';
import { GraphOperationService } from '../../shared-services/graph-operation.service';
import { GraphsController } from './graphs.controller';

@Module({
	imports: [],
	controllers: [
		GraphsController
	],
	providers: [
		GraphOperationService
	]
})
export class GraphsModule { }
