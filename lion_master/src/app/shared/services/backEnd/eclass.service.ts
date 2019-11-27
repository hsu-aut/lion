import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigurationService } from './configuration.service'

/* This service is relevant for the eclass property related interactions with the backend, e.g. get all properties with a keyword */

@Injectable({
  providedIn: 'root'
})
export class EclassService {

  constructor(
    private http: HttpClient,
    private config: ConfigurationService
  ) { }


  getPropertyList(preferredName: string) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
      })
    };

    var request = this.config.getHost() + `/eclassSearch/list?prop=${preferredName}`

    console.log("Query executed");
    console.log(request, httpOptions);
    var re = this.http.get(request, httpOptions);
    console.log(re);
    return re;

  }

}
