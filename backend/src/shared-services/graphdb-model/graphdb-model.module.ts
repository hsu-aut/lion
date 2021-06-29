import { HttpModule, Module } from '@nestjs/common';
import { GraphDbRepositoryModule } from '../graphdb-repository/graphdb-repository.module';
import { GraphDbModelService } from './graphdb-model.service';

@Module({
	imports: [
		HttpModule,
		GraphDbRepositoryModule
	],
	controllers: [],
	providers: [GraphDbModelService],
	exports: [GraphDbModelService]
})
export class GraphDbModelModule {}
