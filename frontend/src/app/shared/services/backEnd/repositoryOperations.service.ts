import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ConfigurationService } from './configuration.service';
import { OdpName } from "@shared/models/odps/odp";
import { MessagesService } from '../messages.service';



/* This service is relevant for repository related interactions with the backend, e.g. creating, deleting repositories */


@Injectable({
    providedIn: 'root'
})
export class RepositoryOperationsService {
    private repository: string;

    constructor(
        private http: HttpClient,
        private config: ConfigurationService,
        private messageService: MessagesService
    ) {}

    public getWorkingRepository(): Observable<string> {
        const url = this.getRepositoryURL();
        const params = {
            type: "current"
        };
        return this.http.get<string>(url, {params: params});
    }

    public setWorkingRepository(repositoryName): Observable<void> {
        const url = this.getRepositoryURL();
        const repoData = {
            repositoryName: repositoryName
        };
        const params = {
            type: "current"
        };
        return this.http.put<void>(url, repoData, {params: params});
    }

    private getRepositoryURL() {
        return this.config.getHost() + '/repositories';
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

    getListOfRepositories() {
        const currentList: Array<string> = [];

        const listObservable = new Observable((observer) => {
            this.http.get(this.getRepositoryURL()).subscribe((data: any) => {

                for (let i = 0; i < data.results.bindings.length; i++) {

                    currentList.push(data.results.bindings[i].id.value);

                    if (i == (data.results.bindings.length - 1)) {
                        observer.next(currentList);
                        observer.complete();
                    }
                }
            });
        });

        return listObservable;
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
