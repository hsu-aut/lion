import { HttpService, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { RepositoryService } from './repository.service';

@Injectable()
export class GraphOperationService {


	constructor(
		private http: HttpService,
		private graphDbRepoService: RepositoryService
	) { }

	/**
	 * Get all triples of a named graph
	 * @param graphName Name of the graph to get all triples from
	 * @param format Return format of the triples
	 * @returns All triples included in the given graph
	 */
	getAllTriples(graphName: string, format: string): Observable<AxiosResponse<any>> {
		// TODO: Format should be an enum

		const currentRepo = this.graphDbRepoService.getCurrentRepository();
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
		return this.http.request<any>(reqConfig);
	}


	// TODO: Check wtf this method does and check whether it really has no return
	setGraph(graphName: string, format: string, triples: string): Observable<AxiosResponse<void>> {
		const currentRepo = this.graphDbRepoService.getCurrentRepository();
		const reqConfig: AxiosRequestConfig = {
			method: 'PUT',
			headers: {
				'Content-Type': format
			},
			responseType: 'text',
			data: triples,
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${currentRepo}/rdf-graphs/service?graph=${graphName}`
		};

		// TODO: Set correct type
		return this.http.request<void>(reqConfig);
	}


	/**
	 * Delete a graph with all its triples
	 * @param graphName Name of the graph to be deleted
	 * @returns void
	 */
	deleteGraph(graphName: string): Observable<AxiosResponse<void>> {
		const currentRepo = this.graphDbRepoService.getCurrentRepository();
		const reqConfig: AxiosRequestConfig = {
			method: 'DELETE',
			responseType: 'text',
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${currentRepo}/rdf-graphs/service?graph=${graphName}`
		};

		// TODO: Check whether it really returns void
		return this.http.request<void>(reqConfig);
	}

	/**
	 * Sets the given triples to a graph overwriting the current contents
	 * @param graph Graph to insert triples into
	 * @param format A string defining the format of the triples
	 * @param triples The actual triples to set
	 * @returns 
	 */
	setTriplesToGraph(graph: string, format: string, triples: string): Observable<AxiosResponse<any>> {
		const currentRepo = this.graphDbRepoService.getCurrentRepository();
		const reqConfig: AxiosRequestConfig = {
			method: 'PUT',
			headers: {
				'Content-Type': format
			},
			responseType: 'text',
			data: triples,
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${currentRepo}/rdf-graphs/service?graph=${graph}`
		};

		// TODO: Check what this returns
		return this.http.request<any>(reqConfig);
	}

	
	/**
	 * Add a set of triples to a given graph
	 * @param ttlContent Triples in turtle format
	 * @param graphName Name of the graph to insert triples into
	 * @returns 
	 */
	addTriplesToGraph(ttlContent: string, graphName: string): Observable<AxiosResponse<void>> {
		const currentRepo = this.graphDbRepoService.getCurrentRepository();
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
