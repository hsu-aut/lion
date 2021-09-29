import { Body, Controller, Delete, Get, Headers, Put, Query } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { GraphOperationService } from '../../shared-services/graph-operation.service';


@Controller('/lion_BE/graphs')
export class GraphsController {
	constructor(private readonly graphService: GraphOperationService) { }
	/**
	 * Get triples of named graph 
	* */
	@Get()
	getTriplesOfNamedGraph(@Query('graph') graph: string, @Headers('accept') format: string): Observable<AxiosResponse<any>> {
		return this.graphService.getAllTriples(decodeURIComponent(graph), format);
	}

	/**
	 * Set triples of named graph
	 */
	@Put()
	setTriplesOfNamedGraph(@Query('graph') graph: string,
		@Headers('accept') format: string,
		@Body() triples: string): Observable<AxiosResponse<any>> {
		return this.graphService.setTriplesToGraph(decodeURIComponent(graph), format, triples);
	}

	/**
	 * Deletes a named graph
	 * @param graph Name of the graph to delete
	 * @returns 
	 */
	@Delete()
	deleteNamedGraph(@Query('graph') graph: string): Observable<AxiosResponse<void>> {
		return this.graphService.deleteGraph(decodeURIComponent(graph));
	}
}
