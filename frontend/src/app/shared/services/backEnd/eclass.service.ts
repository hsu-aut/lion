import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigurationService } from './configuration.service';

/* This service is relevant for the eclass property related interactions with the backend, e.g. get all properties with a keyword */

@Injectable({
    providedIn: 'root'
})
export class EclassService {

    constructor(
    private http: HttpClient,
    private config: ConfigurationService
    ) { }


  getPropertyList(preferredName: string, via: string) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
      })
    };

    var request = this.config.getHost() + `/eclassSearch/list?prop=${preferredName}&via=${via}`

        console.log("Query executed");
        console.log(request, httpOptions);
        const re = this.http.get(request, httpOptions);
        console.log(re);
        return re;

    }

}
