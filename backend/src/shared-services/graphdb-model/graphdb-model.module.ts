import { HttpModule, Module } from '@nestjs/common';
import { GraphDbModelService } from './graphdb-model.service';

@Module({
	imports: [HttpModule],
	controllers: [],
	providers: [GraphDbModelService],
})
export class GraphDbModelModule {}
