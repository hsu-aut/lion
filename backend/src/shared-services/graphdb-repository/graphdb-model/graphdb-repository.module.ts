import { Module } from '@nestjs/common';
import { GraphDbRepositoryService } from './graphdb-repository.service';

@Module({
	imports: [],
	controllers: [],
	providers: [GraphDbRepositoryService],
})
export class GraphDbRepositoryModule {}
