import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ConfigurationService } from '@shared-services/backEnd/configuration.service';
import { MessagesService } from '@shared-services/messages.service';

import { Vdi2206ModelService } from '../../modelling/rdf-models/vdi2206Model.service';


@Injectable({
    providedIn: 'root'
})
export class StepServiceService {

  public stepRoute = '/step';

  constructor(
    private config: ConfigurationService,
    private http: HttpClient,
    private messageService: MessagesService,
    private vdi: Vdi2206ModelService
  ) { }


  /**
   *  This method returns a list of files that are stored in the backend for being mapped.
   *
   * @returns RequestObservable
   * @memberof StepServiceService
   */
  getListOfFiles() {
      const httpOptions = {
          headers: new HttpHeaders({
              'Content-Type': 'none',
          })
      };

      return this.http.get(this.config.getHost() + this.stepRoute, httpOptions);
  }

  /**
   * Method takes a filename and requests to delete that file in the backend.
   *
   * @param {string} fileName
   * @returns Observable of HTTP request
   * @memberof StepServiceService
   */
  deleteFile(fileName: string) {
      const httpOptions = {
          headers: new HttpHeaders({
              'Content-Type': 'none',
          }),
          params: new HttpParams().set('fileName',fileName)
      };
      const request: string =  this.config.getHost() + this.stepRoute;

      return this.http.delete(request, httpOptions);
  }



  /**
   * Method requests to map a stp file to rdf by the backend.
   *
   * @param {string} fileName
   * @returns Observable of HTTP request
   * @memberof StepServiceService
   */
  mapToRDF(fileName: string) {

      const request: string = this.config.getHost() + this.stepRoute + '/rdf';

      const body = {
          fileName: fileName,
          repositoryName: this.config.getRepository()
      };


      const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');



      const insertObservable = new Observable((observer) => {
          this.http.put(request, body, { headers }).pipe(take(1)).subscribe((data: any) => {
              this.messageService.success('Alright!',`Backend processed the file.`);
              observer.next();
              observer.complete();
          },
          error => {
              this.messageService.warn('Ups!',`Seams like the Server responded with a ${error.status} code`);
          });
      });

      return insertObservable;
  }

  /**
   * Method takes a filename and requests a a mapping from .step to json by the back end.
   *
   * @param {string} fileName
   * @returns Observable of the HTTP request, a json should be returned by the backend
   * @memberof StepServiceService
   */
  getJson(fileName: string) {
      const httpOptions = {
          headers: new HttpHeaders({
              'Content-Type': 'none',
          }),
          params: new HttpParams().set('fileName',fileName)
      };
      let request: string;

      request = this.config.getHost() + this.stepRoute + '/json';

      return this.http.get(request, httpOptions);
  }

}
