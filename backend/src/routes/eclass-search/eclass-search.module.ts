import { HttpModule, Module } from '@nestjs/common';
import { EclassSearchController } from './eclass-search.controller';
import { EclassSearchService } from './eclass-search.service';

@Module({
	imports: [HttpModule],
	controllers: [EclassSearchController],
	providers: [EclassSearchService],
})
export class EclassSearchModule {}
