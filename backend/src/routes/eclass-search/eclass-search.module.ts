import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EclassSearchController } from './eclass-search.controller';
import { EclassSearchService } from './eclass-search.service';

@Module({
	imports: [HttpModule],
	controllers: [EclassSearchController],
	providers: [EclassSearchService],
})
export class EclassSearchModule {}
