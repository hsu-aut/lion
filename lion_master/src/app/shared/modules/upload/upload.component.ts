import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from './upload.service';
import { forkJoin, Observable } from 'rxjs'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  lastFileName = "Choose file"
  progressObserver;
  progress: { id: string, percentDone: number }[] = [];
  canBeClosed = true
  primaryButtonText = 'Upload'
  showCancelButton = true
  uploading = false
  uploadSuccessful = false

  @Input() url: string;
  @Input() fileFormats: string[];

  public files: Set<File> = new Set()

  constructor(public uploadService: UploadService) { }

  ngOnInit() {
  }


  /**
   * is called by the template and has files as an input
   *
   * @param {*} files
   * @memberof UploadComponent
   */
  addFiles(files) {
    for (let key in files) {
      if (!isNaN(parseInt(key)) && this.checkFileFormat(files[key].name)) {
        this.files.add(files[key]);
        this.lastFileName = files[key].name;
      }
    }
  }


  /**
   * The upload function is called by the template and triggers the upload service.
   *
   * @memberof UploadComponent
   */
  upload() {
    // clear progress
    this.progress = [];

    // start the upload and save the progress map
    this.progressObserver = this.uploadService.upload(this.files, this.url);

    for (const key in this.progressObserver) {
      let myObject = {
        id: key,
        percentDone: 0
      }
      this.progress.push(myObject)
    }

    // set the component state to "uploading"
    this.uploading = true;

    // convert the progress map into an array
    let allProgressObservables = [];
    for (let key in this.progressObserver) {
      allProgressObservables.push(this.progressObserver[key].progress);
      this.progress.forEach(element => {
        if (element.id == key) {
          this.progressObserver[key].progress.subscribe(data => {
            element.percentDone = data;
          })
        }
      });
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Finish';

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      // console.log(this.progress[Object.keys(this.progress)[0]].progress)
      // ... the dialog can be closed again...
      this.canBeClosed = true;

      // ... the upload was successful...
      this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;
    });
  }


  /**
   *
   * Check for a given filename, if the file ending indicates an allowed file format 
   * @param {string} fileName
   * @returns True if allowed, false otherwise
   * @memberof UploadComponent
   */
  checkFileFormat(fileName: string) {
    let included: Boolean = false;
    this.fileFormats.forEach(element => {
      if (fileName.includes(element)) { included = true }
    });
    return included
  }

}
