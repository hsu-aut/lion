import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { catchError, map, Observable, switchMap } from "rxjs";
import { SparqlResponse } from "@shared/models/sparql/SparqlResponse";
import { RepositoryService } from "./repository.service";
import { GraphDbRequestException } from "../custom-exceptions/GraphDbRequestException";

@Injectable()
export class SparqlService {

	constructor(
        private http: HttpService,
        private repoService: RepositoryService) {}


	/**
	 * Executes a query against the current repository
	 * @param queryString SPARQL query string that will be executed
	 * @returns An observable of the SparqlResponse object
	 * @throws GraphDbRequestException
	 */
	query(queryString: string): Observable<SparqlResponse> {
		return this.repoService.getWorkingRepository().pipe(switchMap(data => {
			const currentRepoId = data.id;
        
			const reqConfig: AxiosRequestConfig = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/sparql-query'
				},
				responseType: 'text',
				data: queryString,
				baseURL: 'http://localhost:7200/',
				url: `/repositories/${currentRepoId}`
			};

			// Return the response body (i.e. the full Sparql Response)
			return this.http.request<SparqlResponse>(reqConfig)
				.pipe(
					map((data: AxiosResponse<SparqlResponse>) => data.data),
					catchError((err:AxiosError) => {
						console.log(err.response.data);
				
						throw new GraphDbRequestException(err.response.data, err.response.status);
					}));
		}));
	}


	/**
     * Execute a SPARQL Update against the current repository
     * @param updateString SPARQL Update string that will be executed
     * @returns 
     */
	update(updateString: string): Observable<void> {
		return this.repoService.getWorkingRepository().pipe(switchMap(data => {
			const currentRepoId = data.id;

			const reqConfig: AxiosRequestConfig = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/sparql-update',
					'Accept': 'application/rdf+xml, */*;q=0.5'
				},
				responseType: 'text',
				data: updateString,
				baseURL: 'http://localhost:7200/',
				url: `/repositories/${currentRepoId}/statements`
			};
        
			// Return the response body (i.e. the full Sparql Response) and catch errors should they occur
			return this.http.request<void>(reqConfig)
				.pipe(
					map(data => data.data), 
					catchError((err:AxiosError) => {
						console.log(err.response.data);
					
						throw new GraphDbRequestException(err.response.data, err.response.status);
					}));
		}));
	}

}