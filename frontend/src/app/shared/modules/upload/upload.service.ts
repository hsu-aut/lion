import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

import { ConfigurationService } from '../../services/backEnd/configuration.service';




@Injectable({
    providedIn: 'root'
})
export class UploadService {

    constructor(
    private http: HttpClient,
    private config: ConfigurationService) { }

  private url: string;


  /**
   * Is called by the component and return a map of file upload progresses
   *
   * @param {Set<File>} files
   * @returns {{ [key: string]: { progress: Observable<number> } }}
   * @memberof UploadService
   */
  public upload(files: Set<File>, url: string):
  { [key: string]: { progress: Observable<number> } } {
      this.url = this.config.getHost() + url;

      // this will be the resulting map
      const status: { [key: string]: { progress: Observable<number> } } = {};

      files.forEach(file => {
          // create a new multipart-form for every file
          const formData: FormData = new FormData();
          formData.append('file', file, file.name);

          // create a http-post request and pass the form
          // tell it to report the upload progress
          const req = new HttpRequest('POST', this.url, formData, {
              reportProgress: true
          });

          // create a new progress-subject for every file
          const progress = new Subject<number>();

          // send the http-request and subscribe for progress-updates
          this.http.request(req).subscribe(event => {
              if (event.type === HttpEventType.UploadProgress) {
                  // console.log(event.loaded)
                  // calculate the progress percentage
                  const percentDone = Math.round(100 * event.loaded / event.total);
                  // console.log(percentDone)
                  // pass the percentage into the progress-stream
                  progress.next(percentDone);
              } else if (event instanceof HttpResponse) {

                  // Close the progress-stream if we get an answer form the API
                  // The upload is complete
                  progress.complete();
              }
          });

          // Save every progress-observable in a map of all observables
          status[file.name] = {
              progress: progress.asObservable()
          };
      });
  
      // return the map of progress.observables
      return status;
  }

}
