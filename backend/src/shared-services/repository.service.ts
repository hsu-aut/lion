import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { gdbConfig } from '../GRAPH_DB_REQUESTS/GDBconfigurator.js';

/**
 * A service that provides functionality to interact with GraphDB repositories
 */
@Injectable()
export class RepositoryService {

	constructor(private http: HttpService) {}

	/**
     * Get a list of all repositories
     * @returns List of the currently existing repositories
     */
	getAllRepositories(): Observable<AxiosResponse<any>> {
		const reqConfig: AxiosRequestConfig = {
			method: 'GET',
			headers: {
				'Accept': 'application/sparql-results+json, */*;q=0.5'
			},
			baseURL: 'http://localhost:7200/',
			url: `/repositories`
		};

		// TODO: Add proper response type
		return this.http.request<any>(reqConfig);
	}

	getCurrentRepository(): string {
		return "test-repo";
	}

	createRepository(repositoryName:string): any {
		
		const formData = new FormData();
		formData.append('config', 'repo-config.ttl');
		formData.append('config', './GRAPHDB_NEW_REPO_CONFIG.ttl');
		// formData.append('config',
		//                 new Blob([file: './GRAPHDB_NEW_REPO_CONFIG.ttl',
		//                                 type: 'rb']));

		// #
		// # Sesame configuration template for a GraphDB Free repository
		// #
		// @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
		// @prefix rep: <http://www.openrdf.org/config/repository#>.
		// @prefix sr: <http://www.openrdf.org/config/repository/sail#>.
		// @prefix sail: <http://www.openrdf.org/config/sail#>.
		// @prefix owlim: <http://www.ontotext.com/trree/owlim#>.
		
		// [] a rep:Repository ;
		// 	rep:repositoryID 'repositoryName' ;
		// 	rdfs:label 'my repository number one' ;
		// 	rep:repositoryImpl [
		// 		rep:repositoryType "graphdb:FreeSailRepository" ;
		// 		sr:sailImpl [
		// 			sail:sailType "graphdb:FreeSail" ;
		
		// 			owlim:owlim-license "" ;
		
		// 			owlim:base-URL "http://example.org/graphdb#" ;
		// 			owlim:defaultNS "" ;
		// 			owlim:entity-index-size "200000" ;
		// 			owlim:entity-id-size  "32" ;
		// 			owlim:imports "" ;
		// 			owlim:repository-type "file-repository" ;
		// 			owlim:ruleset "owl-horst-optimized" ;
		// 			owlim:storage-folder "storage" ;
		
		// 			owlim:enable-context-index "false" ;
		// 			owlim:cache-memory "80m" ;
		// 			owlim:tuple-index-memory "80m" ;
		
		// 			owlim:enablePredicateList "false" ;
		// 			owlim:predicate-memory "0%" ;
		
		// 			owlim:fts-memory "0%" ;
		// 			owlim:ftsIndexPolicy "never" ;
		// 			owlim:ftsLiteralsOnly "true" ;
		
		// 			owlim:in-memory-literal-properties "false" ;
		// 			owlim:enable-literal-index "true" ;
		// 			owlim:index-compression-ratio "-1" ;
		
		// 			owlim:check-for-inconsistencies "false" ;
		// 			owlim:disable-sameAs  "false" ;
		// 			owlim:enable-optimization  "true" ;
		// 			owlim:transaction-mode "safe" ;
		// 			owlim:transaction-isolation "true" ;
		// 			owlim:query-timeout  "0" ;
		// 			owlim:query-limit-results  "0" ;
		// 			owlim:throw-QueryEvaluationException-on-timeout "false" ;
		// 			owlim:useShutdownHooks  "true" ;
		// 			owlim:read-only "false" ;
		// 			owlim:nonInterpretablePredicates "http://www.w3.org/2000/01/rdf-schema#label;http://www.w3.org/1999/02/22-rdf-syntax-ns#type;http://www.ontotext.com/owlim/ces#gazetteerConfig;http://www.ontotext.com/owlim/ces#metadataConfig" ;
		// 		]
		// 	].

		// zu besprechen:

	//  return this.gdbConfig.setRepository(repositoryName): Observable<AxiosResponse<any>> {
	// 	const reqConfig: AxiosRequestConfig = {
	// 		method: 'GET',
	// 		headers: {'Content-Type': 'multipart/form-data'},
	// 		baseURL: 'http://localhost:7200/',
	// 		url: '/rest/repositories',
	// 		data: formData
	// 	};
	// }
	}

	/**
     * Clears a repository with a given ID by deleting all triples
     * @param repositoryId ID of the repository to delete 
     * @returns 
     */
	clearRepository(repositoryId: string): Observable<AxiosResponse<void>> {
		const reqConfig: AxiosRequestConfig = {
			method: 'DELETE',
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${repositoryId}/statements`
		};

		// TODO: Check if it really returns void, if not add proper response type
		return this.http.request<void>(reqConfig);
	}


	/**
     * Deletes an existing repository with a given ID
     * @param repositoryId ID of the repository to delete
     * @returns 
     */
	deleteRepository(repositoryId: string): Observable<AxiosResponse<void>> {
		const reqConfig: AxiosRequestConfig = {
			method: 'DELETE',
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${repositoryId}`
		};

		// TODO: Check if it really returns void, if not add proper response type
		return this.http.request<void>(reqConfig);
	}

}
