import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

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
		return "testdb";
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
