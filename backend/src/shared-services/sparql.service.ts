import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { map, Observable } from "rxjs";
import { SparqlResponse } from "@shared/models/sparql/SparqlResponse";
import { RepositoryService } from "./repository.service";

@Injectable()
export class SparqlService {

	constructor(
        private http: HttpService,
        private repoService: RepositoryService) {}

	/**
     * Executes a query against the current repository
     * @param queryString SPARQL query string that will be executed
     */
	query(queryString: string): Observable<SparqlResponse> {
		const currentRepo = this.repoService.getWorkingRepository();
        
		const reqConfig: AxiosRequestConfig = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/sparql-query'
			},
			responseType: 'text',
			data: queryString,
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${currentRepo}`
		};
		// Return the response body (i.e. the full Sparql Response)
		return this.http.request<SparqlResponse>(reqConfig).pipe(map((data: AxiosResponse<SparqlResponse>) => data.data));
	}


	/**
     * Execute a SPARQL Update against the current repository
     * @param updateString SPARQL Update string that will be executed
     * @returns 
     */
	update(updateString: string): Observable<void> {
		const currentRepo = this.repoService.getWorkingRepository();
        
		const reqConfig: AxiosRequestConfig = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/sparql-update',
				'Accept': 'application/rdf+xml, */*;q=0.5'
			},
			responseType: 'text',
			data: updateString,
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${currentRepo}/statements`
		};
        
		// TODO: Check if it really returns "void"
		return this.http.request<void>(reqConfig).pipe(map(data => data.data));
	}

}