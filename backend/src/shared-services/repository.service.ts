import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RepositoryDto } from '@shared/models/repositories/RepositoryDto';
import { NewRepositoryRequestDto } from '@shared/models/repositories/NewRepositoryRequestDto';
import { Observable, of } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import * as fs from 'fs';
import * as FormData from 'form-data';
import { SparqlResponse } from '../models/sparql/SparqlResponse';
import { GraphDbRequestException } from '../custom-exceptions/GraphDbRequestException';
import { GraphOperationService } from './graph-operation.service';
/**
 * A service that provides functionality to interact with GraphDB repositories
 */
@Injectable()
export class RepositoryService {

	workingRepository: Observable<RepositoryDto> = of({
		id: "testdb",
		title: "testdb",
		uri: "localhost:7200/repositories/testdb",
		readable: true,
		writable: true
	})

	constructor(
		private http: HttpService,
		@Inject(forwardRef(() => GraphOperationService))
		private graphService: GraphOperationService
	) {}

	/**
     * Get a list of all repositories
     * @returns List of the currently existing repositories
     */
	getAllRepositories(): Observable<RepositoryDto[]> {
		const reqConfig: AxiosRequestConfig = {
			method: 'GET',
			headers: {
				'Accept': 'application/sparql-results+json, */*;q=0.5'
			},
			baseURL: 'http://localhost:7200/',
			url: `/repositories`
		};

		return this.http.request<SparqlResponse>(reqConfig).pipe(
			map(axiosResponse => {
				const sparqlResult = axiosResponse.data;
				const bindings = sparqlResult.results.bindings;
				return bindings.map(binding => {
					const bindingEntries = Object.entries(binding);
					const a = new RepositoryDto();
					bindingEntries.forEach(bindingEntry => a[bindingEntry[0]] = bindingEntry[1].value);
					return a;
				});
			})
		);
	}

	setWorkingRepository(repositoryId: string): Observable<RepositoryDto> {
		const repos = this.getAllRepositories();
		const repoToSet = repos.pipe(
			map(repos => repos.find(repo => repo.id === repositoryId)),
		);
		this.workingRepository = repoToSet;
		return this.workingRepository;
	}
	
	/**
	 * Get the currently activated working repository
	 * @returns Observable of the current working repository
	 */
	getWorkingRepository(): Observable<RepositoryDto> {
		return this.workingRepository;
	}


	/**
	 * Creates a new repository with a given name
	 * @param repositoryName Name of the repository that will be created
	 */
	createRepository(newRepositoryRequest: NewRepositoryRequestDto): Observable<void> {
		const {repositoryId, repositoryName} = newRepositoryRequest;
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
			rep:repositoryID '${repositoryId}' ;
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
		fs.writeFileSync("./temp/repo-config.ttl", repoConfig);
		
		// Create form data with the config file
		const form = new FormData();
		form.append('config', fs.createReadStream("./temp/repo-config.ttl"));
		
		// Build the request. Note that headers have to be calculated from the form
		const reqConfig: AxiosRequestConfig = {
			method: 'POST',
			headers: form.getHeaders(),
			baseURL: 'http://localhost:7200',
			url: '/rest/repositories',
			data: form
		};
		const buf = fs.readFileSync("./temp/repo-config.ttl");
		
		// Execute request, file can now be deleted
		return this.http.request<void>(reqConfig).pipe(
			map(res => res.data),
			catchError(error => {throw new GraphDbRequestException(error.message);}),
			tap(res => {
				fs.unlinkSync("./temp/repo-config.ttl");
				this.graphService.addNewGraph("http://lionFacts");
			})
		);	
	}


	/**
     * Clears a repository with a given ID by deleting all triples
     * @param repositoryId ID of the repository to delete 
     * @returns 
     */
	clearRepository(repositoryName: string): Observable<AxiosResponse<null>> {
		const reqConfig: AxiosRequestConfig = {
			method: 'DELETE',
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${repositoryName}/statements`
		};

		return this.http.request<null>(reqConfig).pipe(map(res => res.data));
	}


	/**
     * Deletes an existing repository with a given ID
     * @param repositoryId ID of the repository to delete
     * @returns 
     */
	deleteRepository(repositoryName: string): Observable<AxiosResponse<null>> {
		const reqConfig: AxiosRequestConfig = {
			method: 'DELETE',
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${repositoryName}`
		};

		return this.http.request<null>(reqConfig).pipe(map(res => res.data));
	}

}
