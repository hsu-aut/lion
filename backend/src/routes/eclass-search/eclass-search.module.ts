import { Module } from '@nestjs/common';
import { EclassSearchController } from './eclass-search.controller';
import { EclassSearchService } from './eclass-search.service';

@Module({
	controllers: [EclassSearchController],
	providers: [EclassSearchService],
})
export class EclassSearchModule {}
