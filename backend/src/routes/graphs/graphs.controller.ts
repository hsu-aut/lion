import { BadRequestException, Body, Controller, Delete, Get, Headers, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { map, Observable, switchMap } from 'rxjs';
import { GraphOperationService } from '../../shared-services/graph-operation.service';
import { StringBody } from '../../custom-decorator/StringBodyDecorator';
import { GraphUpdate } from '@shared/models/graphs/GraphUpdate';
import { GraphDto } from '@shared/models/graphs/GraphDto';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('/lion_BE/graphs')
export class GraphsController {
	constructor(
		private readonly graphService: GraphOperationService
	) { }

	/**
	 * Get all graphs filtered by type. Currently, there is only one type ("current"). If type = current, the current graph is returned.
	 * Otherwise all graphs are returned
	 */
	@Get('')
	getGraphs(@Query('type') type?: string): Observable<GraphDto[]> {
		if (type === "current") {
			return this.graphService.getCurrentGraph().pipe(map(graph => [graph]));
		}
		return this.graphService.getAllGraphs();
	}

	@Post('')
	addGraph(@Body() newGraph: GraphUpdate): Observable<void> {
		return this.graphService.addNewGraph(newGraph.graphIri);
	}
	
	/**
	 * Get all triples of a named graph
	 * @param graphName Name of the graph to get all triples from
	 * @param format Return format of the triples (e.g. text/turtle, application/rdf+xml, etc.)
	 * @returns String with all triples (+ Prefixes) included in the given graph
	 */
	@Get(':graphIri/triples')
	getTriplesOfNamedGraph(@Param('graphIri') graphIri: string, @Headers('accept') format: string): Observable<string> {
		return this.graphService.getAllTriples(graphIri, format);
	}


	/**
	 * Import triples from a file into a named graph
	 * @param graphName Name of the graph to get all triples from
	 * @param format Return format of the triples (e.g. text/turtle, application/rdf+xml, etc.)
	 * @returns String with all triples (+ Prefixes) included in the given graph
	 */
	@Post(':graphIri/triples')
	@UseInterceptors(FileInterceptor('file'))
	importTriplesIntoGraph(@UploadedFile() file: Express.Multer.File, @Param('graphIri') graphIri: string): Observable<void> {
		return this.graphService.importFileIntoGraph(file, graphIri);
	}


	/**
	 * Can be used to set the current graph. Currently, this only checks for type == current, there could be more in the future
	 * @param type 
	 * @param graphUpdate 
	 */
	@Put('')
	setCurrentGraph(@Query('type') type: string, @Body() graphUpdate: GraphUpdate): Observable<GraphDto> {
		if(type === 'current') return this.graphService.setCurrentGraph(graphUpdate);
		throw new BadRequestException(`Missing or wrong type. 
			Make sure to set a query parameter type to "current" in case you want to change the current graph`);
	}


	/**
	 * Sets the given triples to a graph overwriting (!) the current contents
	 * @param graph Graph to insert triples into
	 * @param format A string defining the format of the triples (e.g. text/turtle, application/rdf+xml, etc.)
	 * @param triples The actual triples to set
	 * @returns void
	 */
	@Put(':graphIri/triples')
	setTriplesOfNamedGraph(
		@Param('graphIri') graphIri: string, 
		@Headers('accept') format = 'text/turtle', 
		@StringBody() triples: string): Observable<void> {
		return this.graphService.setTriplesToGraph(decodeURIComponent(graphIri), format, triples);
	}

	@Delete(':graphIri/triples')
	deleteTriplesOfNamedGraph(@Param('graphIri') graphIri: string): Observable<void> {
		// To clear all triples, we simply set empty data as there is no dedicated clear method
		const triples = "http://www.w3.org/2002/07/owl#Class a http://www.w3.org/2000/01/rdf-schema#Class.";
		const format = "text/turtle";
		return this.graphService.setTriplesToGraph(decodeURIComponent(graphIri), format, triples);
	}

	/**
	 * Deletes a named graph
	 * @param graph Name of the graph to delete
	 * @returns void
	 */
	@Delete(':graphIri')
	deleteNamedGraph(@Param('graphIri') graphIri: string): Observable<void> {
		return this.graphService.getCurrentGraph().pipe(switchMap(currentGraph => {
			if (currentGraph.graphIri === graphIri) throw new BadRequestException("Cannot delete active graph");
			return this.graphService.deleteGraph(decodeURIComponent(graphIri));
		}));
	}
}
