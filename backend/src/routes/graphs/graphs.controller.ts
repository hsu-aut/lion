import { Controller, Delete, Get, Headers, Put, Query } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GraphOperationService } from '../../shared-services/graph-operation.service';
import { StringBody } from '../../custom-decorator/StringBodyDecorator';




@Controller('/lion_BE/graphs')
export class GraphsController {
	constructor(private readonly graphService: GraphOperationService) { }

	/**
	 * Get all triples of a named graph
	 * @param graphName Name of the graph to get all triples from
	 * @param format Return format of the triples (e.g. text/turtle, application/rdf+xml, etc.)
	 * @returns String with all triples (+ Prefixes) included in the given graph
	 */
	@Get()
	getTriplesOfNamedGraph(@Query('graph') graph: string, @Headers('accept') format: string): Observable<AxiosResponse<string>> {
		return this.graphService.getAllTriples(decodeURIComponent(graph), format).pipe(map((data: AxiosResponse) => { return data.data;}));
	}

	/**
	 * Sets the given triples to a graph overwriting (!) the current contents
	 * @param graph Graph to insert triples into
	 * @param format A string defining the format of the triples (e.g. text/turtle, application/rdf+xml, etc.)
	 * @param triples The actual triples to set
	 * @returns void
	 */
	@Put()
	setTriplesOfNamedGraph(@Query('graph') graph: string,
		@Headers('accept') format: string,
		@StringBody() triples: string): void {
		this.graphService.setTriplesToGraph(decodeURIComponent(graph), format, triples).subscribe((data) => console.log(data.data));
	}

	/**
	 * Deletes a named graph
	 * @param graph Name of the graph to delete
	 * @returns void
	 */
	@Delete()
	deleteNamedGraph(@Query('graph') graph: string): void {
		this.graphService.deleteGraph(decodeURIComponent(graph)).subscribe((data) => console.log(data.data));
	}
}
