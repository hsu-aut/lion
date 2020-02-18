import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ConfigurationService } from '../../shared/services/backEnd/configuration.service';
import { GraphOperationsService } from '../../shared/services/backEnd/graphOperations.service';
import { RepositoryOperationsService } from '../../shared/services/backEnd/repositoryOperations.service';
import { MessagesService } from '../../shared/services/messages.service';


@Injectable({
  providedIn: 'root'
})
export class StepServiceService {

  public stepRoute = '/step';

  constructor(
    private config: ConfigurationService,
    private http: HttpClient,
    private graphs: GraphOperationsService,
    private repos: RepositoryOperationsService,
    private messageService: MessagesService
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

  /**
   * Method takes a filename and requests to delete that file in the backend.
   *
   * @param {string} fileName
   * @returns Observable of HTTP request
   * @memberof StepServiceService
   */
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



  /**
   * Method requests to map a stp file to rdf by the backend.
   *
   * @param {string} fileName
   * @returns Observable of HTTP request
   * @memberof StepServiceService
   */
  mapToRDF(fileName: string) {

    let request: string = this.config.getHost() + this.stepRoute + '/rdf';

    let body = {
      fileName: fileName,
      activeGraph: this.graphs.getGraphs()[this.graphs.getActiveGraph()],
      repositoryName: this.repos.getRepository()
    }
    

    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json')
    


    var insertObservable = new Observable((observer) => {
      this.http.put(request, body, { headers }).pipe(take(1)).subscribe((data: any) => {
        this.messageService.addMessage('success', 'Alright!', `Backend is processing the file. This may take a while.`);
        observer.next()
        observer.complete()
      },
        error => {
          this.messageService.addMessage('error', 'Ups!', `Seams like the Server responded with a ${error.status} code`);
        });
    })

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
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'none',
      })
    };
    var request: string;

    request = this.config.getHost() + this.stepRoute + '/json' + `?fileName=${fileName}`;

    return this.http.get(request, httpOptions);
  }

}
