import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigurationService } from '../../shared/services/backEnd/configuration.service'

@Injectable({
  providedIn: 'root'
})
export class StepServiceService {

  public stepRoute = '/step';

  constructor(
    private config: ConfigurationService,
    private http: HttpClient
  ) { }


  /**
   *  This method returns a list of files that are stored in the backend for being mapped.
   *
   * @returns RequestObservable
   * @memberof StepServiceService
   */
  getListOfFiles() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
      })
    };

    return this.http.get(this.config.getHost() + this.stepRoute, httpOptions);
  }

  deleteFile(fileName: string) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
      })
    };
    var request: string;

    if (fileName) {
      request = this.config.getHost() + this.stepRoute + `?fileName=${fileName}`;
    } else {
      request = this.config.getHost() + this.stepRoute;
    }

    return this.http.delete(request, httpOptions);
  }

  getJson(fileName: string) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
      })
    };
    var request: string;

      request = this.config.getHost() + this.stepRoute + '/tojson' +`?fileName=${fileName}`;

    return this.http.get(request, httpOptions);
  }

}
