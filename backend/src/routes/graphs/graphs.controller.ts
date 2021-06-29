import { Body, Controller, Delete, Get, Headers, Put, Query } from '@nestjs/common';
import { GraphsService } from './graphs.service';


@Controller('/lion_BE/graphs')
export class GraphsController {
	constructor(private readonly graphService: GraphsService) { }
    /**
     * Get triples of named graph 
    * */
    @Get()
	getTriplesOfNamedGraph(@Query('graph') graph: string,
        @Query('repositoryName') repositoryName: string ,
        @Headers('accept') format: string): string {
		return this.graphService.getTriplesOfNamedGraph(repositoryName, decodeURIComponent(graph), format);
	}

    /**
     * Set triples of named graph
     */
    @Put()
    setTriplesOfNamedGraph(@Query('graph') graph: string,
        @Query('repositoryName') repositoryName: string,
        @Headers('accept') format: string,
        @Body() triples: string): string {
    	return this.graphService.setTriplesOfNamedGraph(repositoryName, decodeURIComponent(graph), format, triples);
    }

    /**
     * Deletes named graph
     */
    @Delete()
    deleteNamedGraph(@Query('graph') graph: string,
        @Query('repositoryName') repositoryName: string): string {
    	return this.graphService.deleteNamedGraph(repositoryName, decodeURIComponent(graph));
    }
}
