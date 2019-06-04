import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataLoaderService } from "../../../../shared/services/dataLoader.service";

@Injectable({
  providedIn: 'root'
})
export class BackEndRequestsService {
  url: string;

  constructor(
    private http: HttpClient,
    private loadingScreenService: DataLoaderService) {
    this.url = `/lion_BE`;
  }

  loadTBoxes(repositoryName, TBox) {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
        'responseType': 'text'
      })
    };
    var request = this.url + `/repositories/buildTBox?pattern=${TBox}&repositoryName=${repositoryName}`
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

  clearRepo(repositoryName) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
        'responseType': 'text'
      })
    };
    var request = this.url + `/repositories/clear?repositoryName=${repositoryName}`
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



}
