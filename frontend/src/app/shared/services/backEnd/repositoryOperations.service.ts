import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, take } from 'rxjs';
import { RepositoryDto } from '@shared/models/repositories/RepositoryDto';
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

    getListOfRepositories(): Observable<RepositoryDto[]> {
        return this.http.get<RepositoryDto[]>(this.getRepositoryURL());
    }

    public getCurrentRepository(): Observable<RepositoryDto> {
        const url = this.getRepositoryURL();
        const params = {
            type: "current"
        };
        return this.http.get<RepositoryDto[]>(url, {params: params}).pipe(map(repos => repos[0]));
    }

    public setWorkingRepository(repositoryId: string): Observable<RepositoryDto> {
        console.log(repositoryId);

        const url = this.getRepositoryURL();
        const repoData = {
            repositoryId: repositoryId
        };
        const params = {
            type: "current"
        };
        return this.http.put<RepositoryDto>(url, repoData, {params: params});
    }




    createRepository(repositoryName: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'none',
                'responseType': 'text'
            })
        };

        const request = this.getRepositoryURL() + `/create?repositoryName=${repositoryName}`;
        const dbObservale = new Observable((observer) => {
            this.http.get(request, httpOptions).subscribe((data: any) => {
                this.messageService.addMessage('success', 'Done!', 'Created the repository ' + repositoryName + '. You may want to add TBoxes to it.');
                observer.next(data);
                observer.complete();
            });
        });
        return dbObservale;
    }



    deleteRepository(repositoryName) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'none',
                'responseType': 'text'
            })
        };
        const request = this.getRepositoryURL() + `/${repositoryName}`;
        const dbObservale = new Observable((observer) => {
            this.http.delete(request, httpOptions).subscribe((data: any) => {
                this.messageService.addMessage('success', 'Done!', 'Deleted the repository ' + repositoryName);
                observer.next(data);
                observer.complete();
            });
        });
        return dbObservale;
    }

    /**
     * Clears all content (i.e., all statements) from a repository
     * @param repositoryName
     * @returns
     */
    clearRepository(repositoryName: string) {
        const request = this.getRepositoryURL() + `/${repositoryName}/statements`;
        const dbObservale = new Observable((observer) => {
            this.http.delete(request).subscribe((data: any) => {
                this.messageService.addMessage('success', 'Done!', 'Cleared the repository ' + repositoryName + '. You may want to add TBoxes to it again.');
                observer.next(data);
                observer.complete();
            });
        });
        return dbObservale;
    }

}
