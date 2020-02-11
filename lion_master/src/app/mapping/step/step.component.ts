import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {

  private stepURL = "/step"

  constructor() { }

  ngOnInit() {
  }


  percentDone: number = 20;
  uploadSuccess: boolean;
  fileName: string = "Choose file"

  upload(files: File[]) {
    this.fileName = files[0].name;
    this.uploadAndProgress(files);
  }


  uploadAndProgress(files: File[]) {
    console.log(files)
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file', f))
    console.log(formData)
    // this.http.post('https://file.io', formData, { reportProgress: true, observe: 'events' })
    //   .subscribe(event => {
    //     if (event.type === HttpEventType.UploadProgress) {
    //       this.percentDone = Math.round(100 * event.loaded / event.total);
    //     } else if (event instanceof HttpResponse) {
    //       this.uploadSuccess = true;
    //     }
    //   });
  }
}