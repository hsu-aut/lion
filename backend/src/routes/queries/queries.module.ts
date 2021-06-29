import { Module } from '@nestjs/common';
import { QuerieController } from './queries.controller';
import { QuerieService } from './queries.service';

@Module({
	imports: [],
	controllers: [
		QuerieController
	],
	providers: [
		QuerieService
	],
})
export class QueriesModule {}
