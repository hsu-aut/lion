import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ConfigurationService } from './configuration.service'
import { DataLoaderService } from "../../../../../shared/services/dataLoader.service";



/* This service is relevant for repository related interactions with the backend, e.g. creating, deleting repositories */


@Injectable({
  providedIn: 'root'
})
export class RepositoryOperationsService {

  private repository: string;

  constructor(
    private http: HttpClient,
    private config: ConfigurationService,
    private loadingScreenService: DataLoaderService
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
        console.log(data)
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

  clearRepository(repositoryName) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
        'responseType': 'text'
      })
    };
    var request = this.getRepositoryURL() + `/clear?repositoryName=${repositoryName}`
    console.log(request, httpOptions);
    var dbObservale = new Observable((observer) => {
      this.http.get(request, httpOptions).subscribe((data: any) => {

        console.log(data)
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
        this.loadingScreenService.stopLoading();
        console.log(data)
        observer.next(data)
        observer.complete()
      });
    })
    return dbObservale;
  }

}
