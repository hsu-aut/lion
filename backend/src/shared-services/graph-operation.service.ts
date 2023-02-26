import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { RepositoryService } from './repository.service';
import { GraphUpdate} from '@shared/models/graphs/GraphUpdate';
import { SparqlResponse } from '../models/sparql/SparqlResponse';
import { GraphDbRequestException } from '../custom-exceptions/GraphDbRequestException';
import { GraphDto } from '@shared/models/graphs/GraphDto';

@Injectable()
export class GraphOperationService {

	private currentGraph: Observable<GraphDto> = of({
		graphIri: "http://lionFacts"
	});

	constructor(
		private http: HttpService,
		@Inject(forwardRef(() => RepositoryService))
		private repoService: RepositoryService
	) { }


	getAllGraphs(): Observable<Array<GraphDto>> {
		return this.repoService.getWorkingRepository().pipe(switchMap(workingRepo => {
			const requestConfig: AxiosRequestConfig = {
				method: 'GET',
				headers: {
					'Accept': 'application/json'
				},
				responseType: 'json',
				baseURL: 'http://localhost:7200/',
				url: `/repositories/${workingRepo.id}/rdf-graphs`
			};
			return this.http.request<SparqlResponse>(requestConfig).pipe(
				map(res => res.data.results.bindings.map(resultBinding => new GraphDto(resultBinding['contextID'].value))),
				catchError(error => {throw new Error(error);})
			);
		}));
		
	}

	addNewGraph(newGraphIri: string): Observable<void>{
		// GraphDB has no direct function to add new graphs, we simply add a trivial statement to a non-existing graph. This will create the new graph, too
		const decodedGraphIri = encodeURIComponent(newGraphIri);
		return this.repoService.getWorkingRepository().pipe(switchMap(workingRepo => {
			const requestConfig: AxiosRequestConfig = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-turtle;charset=UTF-8'
				},
				baseURL: 'http://localhost:7200/',
				data: `owl:Class a rdfs:Class.`,
				url: `/repositories/${workingRepo.id}/rdf-graphs/service?graph=${decodedGraphIri}`
			};
			return this.http.request<void>(requestConfig).pipe(map(axiosResponse => axiosResponse.data));
		}));
	}

	/**
	 * Sets the current working graph
	 * @param graphUpdate New graph info
	 */
	setCurrentGraph(graphUpdate: GraphUpdate): Observable<GraphDto> {
		const graphToSet = this.getAllGraphs().pipe(map(graphs => graphs.find(graph => (graph.graphIri === graphUpdate.graphIri))));
		graphToSet.subscribe(data => console.log(data));
		if (!graphToSet) throw new GraphDbRequestException(`Graph with IRI ${graphUpdate.graphIri} does not exist`);
		
		this.currentGraph = graphToSet;
		return graphToSet;
	}


	/**
	 * Simply returns the current graph to be used in queries
	 * @returns The current working graph
	 */
	getCurrentGraph(): Observable<GraphDto> {
		return this.currentGraph;
	}


	/**
	 * Get all triples of a named graph
	 * @param graphName Name of the graph to get all triples from
	 * @param format Return format of the triples
	 * @returns All triples included in the given graph
	 */
	getAllTriples(graphName: string, format: string): Observable<string> {
		// TODO: Format should be an enum
		
		const currentRepo = this.repoService.getWorkingRepository();
		const reqConfig: AxiosRequestConfig = {
			method: 'GET',
			headers: {
				'Accept': format
			},
			responseType: 'text',
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${currentRepo}/rdf-graphs/service?graph=${graphName}`
		};

		// TODO: Set correct type
		return this.http.request<string>(reqConfig).pipe(
			map(res => res.data),
			catchError(error => {throw new Error(error);})
		);
	}


	/**
	 * Delete a graph with all its triples
	 * @param graphName Name of the graph to be deleted
	 * @returns void
	 */
	deleteGraph(graphName: string): Observable<void> {
		return this.repoService.getWorkingRepository().pipe(switchMap(workingRepo => {
			
			const reqConfig: AxiosRequestConfig = {
				method: 'DELETE',
				responseType: 'text',
				baseURL: 'http://localhost:7200/',
				url: `/repositories/${workingRepo.id}/rdf-graphs/service?graph=${graphName}`
			};
	
			return this.http.request<void>(reqConfig).pipe(
				catchError(err => {
					console.log(err);
					throw new GraphDbRequestException();
				}),
				map(res => res.data));
		}));
	}


	/**
	 * Sets the given triples to a graph overwriting the current contents
	 * @param graphIri Graph to insert triples into
	 * @param format A string defining the format of the triples
	 * @param triples The actual triples to set
	 * @returns 
	 */
	setTriplesToGraph(graphIri: string, format: string, triples: string): Observable<void> {
		return this.repoService.getWorkingRepository().pipe(switchMap(workingRepository => {
			const reqConfig: AxiosRequestConfig = {
				method: 'PUT',
				headers: {
					'Content-Type': format
				},
				responseType: 'text',
				data: triples,
				baseURL: 'http://localhost:7200/',
				url: `/repositories/${workingRepository.id}/rdf-graphs/service?graph=${graphIri}`
			};
	
			// TODO: Check what this returns
			return this.http.request<void>(reqConfig).pipe(
				catchError((err:AxiosError) => {
					throw new GraphDbRequestException(err.message);
				}),
				map(res => res.data),
			);
		}));
	}

	
	/**
	 * Add a set of triples to a given graph
	 * @param ttlContent Triples in turtle format
	 * @param graphName Name of the graph to insert triples into
	 * @returns 
	 */
	addTriplesToGraph(ttlContent: string, graphName: string): Observable<AxiosResponse<void>> {
		const currentRepo = this.repoService.getWorkingRepository();
		const reqConfig: AxiosRequestConfig = {
			method: 'POST',
			headers: {
				'Content-Type': "text/turtle"
			},
			responseType: 'text',
			data: ttlContent,
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${currentRepo}/rdf-graphs/service?graph=${graphName}`
		};

		// TODO: Check whether it really returns void
		return this.http.request<void>(reqConfig);
	}

}
