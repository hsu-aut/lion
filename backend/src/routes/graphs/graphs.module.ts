import { Module } from '@nestjs/common';
import { GraphsController } from './graphs.controller';
import { GraphsService } from './graphs.service';

@Module({
	imports: [],
	controllers: [
		GraphsController
	],
	providers: [
		GraphsService
	]
})
export class GraphsModule { }
