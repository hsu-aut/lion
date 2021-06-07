import { Controller, Delete, Get, Put } from '@nestjs/common';
import { GraphsService } from './graphs.service';


@Controller('/lion_BE/graphs')
export class GraphsController {
	constructor(private readonly graphService: GraphsService) { }
    /**
     * Get triples of named graph 
    * */
    @Get()
	getTriplesOfNamedGraph() : string {
		return this.graphService.getTriplesOfNamedGraph();
	}

    /**
     * Set triples of named graph
     */
    @Put()
    setTriplesOfNamedGraph() : string {
    	return this.graphService.setTriplesOfNamedGraph();
    }
    
    /**
     * Deletes named graph
     */
    @Delete()
    deleteNamedGraph() : string {
    	return this.graphService.deleteNamedGraph();
    }
}
