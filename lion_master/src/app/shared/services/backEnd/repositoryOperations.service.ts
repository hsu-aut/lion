import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ConfigurationService } from './configuration.service'
import { DataLoaderService } from "../dataLoader.service";

import { MessagesService } from '../messages.service'



/* This service is relevant for repository related interactions with the backend, e.g. creating, deleting repositories */


@Injectable({
  providedIn: 'root'
})
export class RepositoryOperationsService {

  private repository: string;

  constructor(
    private http: HttpClient,
    private config: ConfigurationService,
    private loadingScreenService: DataLoaderService,
    private messageService: MessagesService
  ) {
    // default repository
    this.repository = 'testdb';
  }

  public getRepository() {
    return this.repository
  }

  private setRepository(repositoryName) {
    this.repository = repositoryName
  }

  private getRepositoryURL() {
    return this.config.getHost() + '/repositories';
  }


  createRepository(repositoryName) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
        'responseType': 'text'
      })
    };

    var request = this.getRepositoryURL() + `/create?repositoryName=${repositoryName}`
    console.log(request, httpOptions);
    var dbObservale = new Observable((observer) => {
      this.http.get(request, httpOptions).subscribe((data: any) => {
        this.setRepository(repositoryName);
        this.messageService.addMessage('success', 'Done!', 'Created the repository ' + repositoryName + '. You may want to add TBoxes to it.')
        observer.next(data)
        observer.complete()
      });
    })
    return dbObservale;
  }

  getListOfRepositories() {
    var currentList: Array<String> = [];

    var listObservable = new Observable((observer) => {
      this.http.get(this.getRepositoryURL()).subscribe((data: any) => {

        for (let i = 0; i < data.results.bindings.length; i++) {

          currentList.push(data.results.bindings[i].id.value)

          if (i == (data.results.bindings.length - 1)) {
            observer.next(currentList)
            observer.complete()
          }
        }
      });
    })

    return listObservable;
  }

  deleteRepository(repositoryName) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
        'responseType': 'text'
      })
    };
    var request = this.getRepositoryURL() + `?repositoryName=${repositoryName}`
    var dbObservale = new Observable((observer) => {
      this.http.delete(request, httpOptions).subscribe((data: any) => {
        this.messageService.addMessage('success', 'Done!', 'Deleted the repository ' + repositoryName)
        observer.next(data)
        observer.complete()
      });
    })
    return dbObservale;
  }

  clearRepository(repositoryName) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
        'responseType': 'text'
      })
    };
    var request = this.getRepositoryURL() + `/clear?repositoryName=${repositoryName}`
    var dbObservale = new Observable((observer) => {
      this.http.get(request, httpOptions).subscribe((data: any) => {
        this.messageService.addMessage('success', 'Done!', 'Cleared the repository ' + repositoryName + '. You may want to add TBoxes to it again.')
        observer.next(data)
        observer.complete()
      });
    })
    return dbObservale;
  }

  loadTBoxes(repositoryName, TBox) {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
        'responseType': 'text'
      })
    };
    var request = this.getRepositoryURL() + `/buildTBox?pattern=${TBox}&repositoryName=${repositoryName}`
    console.log(request, httpOptions);

    this.loadingScreenService.startLoading();

    var dbObservale = new Observable((observer) => {
      this.http.get(request, httpOptions).subscribe((data: any) => {
        this.messageService.addMessage('success', 'Done!', 'loaded ' + TBox)
        this.loadingScreenService.stopLoading();
        console.log(data)
        observer.next(data)
        observer.complete()
      });
    })
    return dbObservale;
  }

}
