import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import * as fs from 'fs';
const FormData = require('form-data');
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
		return this.http.request<any>(reqConfig).pipe(map(res => res.data));
	}

	
	getCurrentRepository(): string {
		return "test";
	}

	/**
	 * Creates a new repository with a given name
	 * @param repositoryName Name of the repository that will be created
	 */
	createRepository(repositoryName:string): Observable<void> {
		
		const repoConfig = `
		#
		# Sesame configuration template for a GraphDB Free repository
		#
		@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
		@prefix rep: <http://www.openrdf.org/config/repository#>.
		@prefix sr: <http://www.openrdf.org/config/repository/sail#>.
		@prefix sail: <http://www.openrdf.org/config/sail#>.
		@prefix owlim: <http://www.ontotext.com/trree/owlim#>.
		
		[] a rep:Repository ;
			rep:repositoryID '${repositoryName}' ;
			rdfs:label '${repositoryName}' ;
			rep:repositoryImpl [
				rep:repositoryType "graphdb:FreeSailRepository" ;
				sr:sailImpl [
					sail:sailType "graphdb:FreeSail" ;
		
					owlim:owlim-license "" ;
		
					owlim:base-URL "http://example.org/graphdb#" ;
					owlim:defaultNS "" ;
					owlim:entity-index-size "200000" ;
					owlim:entity-id-size  "32" ;
					owlim:imports "" ;
					owlim:repository-type "file-repository" ;
					owlim:ruleset "owl-horst-optimized" ;
					owlim:storage-folder "storage" ;
		
					owlim:enable-context-index "false" ;
					owlim:cache-memory "80m" ;
					owlim:tuple-index-memory "80m" ;
		
					owlim:enablePredicateList "false" ;
					owlim:predicate-memory "0%" ;
		
					owlim:fts-memory "0%" ;
					owlim:ftsIndexPolicy "never" ;
					owlim:ftsLiteralsOnly "true" ;
		
					owlim:in-memory-literal-properties "false" ;
					owlim:enable-literal-index "true" ;
					owlim:index-compression-ratio "-1" ;
		
					owlim:check-for-inconsistencies "false" ;
					owlim:disable-sameAs  "false" ;
					owlim:enable-optimization  "true" ;
					owlim:transaction-mode "safe" ;
					owlim:transaction-isolation "true" ;
					owlim:query-timeout  "0" ;
					owlim:query-limit-results  "0" ;
					owlim:throw-QueryEvaluationException-on-timeout "false" ;
					owlim:useShutdownHooks  "true" ;
					owlim:read-only "false" ;
					owlim:nonInterpretablePredicates "http://www.w3.org/2000/01/rdf-schema#label;http://www.w3.org/1999/02/22-rdf-syntax-ns#type;http://www.ontotext.com/owlim/ces#gazetteerConfig;http://www.ontotext.com/owlim/ces#metadataConfig" ;
				]
			].`;

		// Config has to be used as a file, so we store the config to file
		fs.writeFileSync("./repo-config.ttl", repoConfig);

		// Create form data with the config file
		const form = new FormData();
		form.append('config', fs.createReadStream("./repo-config.ttl"));

		// Build the request. Note that headers have to be calculated from the form
		const reqConfig: AxiosRequestConfig = {
			method: 'POST',
			headers: form.getHeaders(),
			baseURL: 'http://localhost:7200',
			url: '/rest/repositories',
			data: form
		};
		
		// Execute request, file can now be deleted
		fs.unlink("./repo-config.ttl", () => {});
		return this.http.request<void>(reqConfig).pipe(map(res => res.data));	
	}


	/**
     * Clears a repository with a given ID by deleting all triples
     * @param repositoryId ID of the repository to delete 
     * @returns 
     */
	clearRepository(): Observable<AxiosResponse<null>> {
		const currentRepo = this.getCurrentRepository();
		const reqConfig: AxiosRequestConfig = {
			method: 'DELETE',
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${currentRepo}/statements`
		};

		return this.http.request<null>(reqConfig).pipe(map(res => res.data));
	}


	/**
     * Deletes an existing repository with a given ID
     * @param repositoryId ID of the repository to delete
     * @returns 
     */
	deleteRepository(): Observable<AxiosResponse<null>> {
		const currentRepo = this.getCurrentRepository();
		const reqConfig: AxiosRequestConfig = {
			method: 'DELETE',
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${currentRepo}`
		};

		return this.http.request<null>(reqConfig).pipe(map(res => res.data));
	}

}
