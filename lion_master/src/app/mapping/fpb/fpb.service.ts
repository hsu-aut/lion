import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ConfigurationService } from '../../shared/services/backEnd/configuration.service';
import { GraphOperationsService } from '../../shared/services/backEnd/graphOperations.service';
import { MessagesService } from '../../shared/services/messages.service';

import { Vdi3682ModelService } from '../../modelling/rdf-models/vdi3682Model.service';

@Injectable({
  providedIn: 'root'
})
export class FpbService {

  public fpbRoute = '/fpb';

constructor(
  private config: ConfigurationService,
  private http: HttpClient,
  private graphs: GraphOperationsService,
  private messageService: MessagesService,
  private vdi: Vdi3682ModelService
) { }


  /**
   *  This method returns a list of files that are stored in the backend for being mapped.
   *
   * @returns RequestObservable
   * @memberof FpbService
   */
  getListOfFiles() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
      })
    };

    return this.http.get(this.config.getHost() + this.fpbRoute, httpOptions);
  }

  /**
   * Method takes a filename and requests to delete that file in the backend.
   *
   * @param {string} fileName
   * @returns Observable of HTTP request
   * @memberof FpbService
   */
  deleteFile(fileName: string) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
      }),
      params: new HttpParams().set('fileName',fileName)
    };
    var request: string = this.config.getHost() + this.fpbRoute;

    return this.http.delete(request, httpOptions);
  }



  /**
   * Method requests to map a .json file to rdf by the backend.
   *
   * @param {string} fileName
   * @returns Observable of HTTP request
   * @memberof FpbService
   */
  mapToRDF(fileName: string) {

    let request: string = this.config.getHost() + this.fpbRoute + '/rdf';

    let body = {
      fileName: fileName,
      activeGraph: this.graphs.getGraphs()[this.graphs.getActiveGraph()],
      repositoryName: this.config.getRepository()
    }
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json')
    
    var insertObservable = new Observable((observer) => {
      this.http.put(request, body, { headers }).pipe(take(1)).subscribe((data: any) => {
        this.messageService.addMessage('success', 'Alright!', `Backend processed the file.`);
        this.vdi.initializeVDI3682();
        observer.next();
        observer.complete();
      },
        error => {
          this.messageService.addMessage('error', 'Ups!', `Seams like the Server responded with a ${error.status} code`);
        });
    })

    return insertObservable;
  }

}
