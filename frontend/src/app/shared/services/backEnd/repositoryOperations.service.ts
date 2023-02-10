import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { RepositoryDto } from '@shared/models/repositories/RepositoryDto';
import { NewRepositoryRequestDto } from '@shared/models/repositories/NewRepositoryRequestDto';
import { ConfigurationService } from './configuration.service';
import { MessagesService } from '../messages.service';



/* This service is relevant for repository related interactions with the backend, e.g. creating, deleting repositories */


@Injectable({
    providedIn: 'root'
})
export class RepositoryOperationsService {

    constructor(
        private http: HttpClient,
        private config: ConfigurationService,
        private messageService: MessagesService
    ) {}

    private getRepositoryURL() {
        return this.config.getHost() + '/repositories';
    }

    /**
     * Loads a list of all currently existing repositories
     * @returns A list of all repositories in the form of RepositoryDto
     */
    getListOfRepositories(): Observable<RepositoryDto[]> {
        return this.http.get<RepositoryDto[]>(this.getRepositoryURL());
    }

    public getWorkingRepository(): Observable<RepositoryDto> {
        const url = this.getRepositoryURL();
        const params = {
            type: "current"
        };
        return this.http.get<RepositoryDto[]>(url, {params: params}).pipe(map(repos => repos[0]));
    }

    public setWorkingRepository(repositoryId: string): Observable<RepositoryDto> {
        const url = this.getRepositoryURL();
        const repoData = {
            repositoryId: repositoryId
        };
        const params = {
            type: "current"
        };
        return this.http.put<RepositoryDto>(url, repoData, {params: params});
    }

    /**
     * Create a repository with a given ID and name
     * @param newRepositoryRequest Object containing new repository ID and name
     * @returns A void observable
     */
    createRepository(newRepositoryRequest: NewRepositoryRequestDto): Observable<void> {
        const url = this.getRepositoryURL();
        return this.http.post<void>(url, newRepositoryRequest);
    }

    /**
     * Clear a repository with a given ID
     * @param repositoryId ID of the repository to delete
     * @returns A void obsersable
     */
    deleteRepository(repositoryId: string): Observable<void> {
        const url = this.getRepositoryURL() + `/${repositoryId}`;
        return this.http.delete<void>(url);
    }

    /**
     * Clears all content (i.e., all statements) from a repository with a given ID
     * @param repositoryId ID of the repository to clear
     * @returns A void obsersable
     */
    clearRepository(repositoryId: string): Observable<void> {
        const url = this.getRepositoryURL() + `/${repositoryId}/statements`;
        return this.http.delete<void>(url);
    }

}
