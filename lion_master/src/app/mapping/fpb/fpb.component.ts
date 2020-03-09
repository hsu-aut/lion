import { Component, OnInit } from '@angular/core';
import { FpbService } from './fpb.service';
import { take } from 'rxjs/operators';

import { FpbStepService } from '../connectors/fpb-step/fpb-step.service';

@Component({
  selector: 'app-fpb',
  templateUrl: './fpb.component.html',
  styleUrls: ['./fpb.component.scss']
})
export class FpbComponent implements OnInit {

  public fpbURL = this.fpb.fpbRoute;
  public fpbJSON = {}
  public uploadedFiles = ["Do you have a connection to the backend?"]
  public fileType = [".json"]

  constructor(
    private fpb: FpbService,
    private connector: FpbStepService
  ) { }

  ngOnInit() {
    this.getListofFiles();
  }

  getListofFiles() {
    this.fpb.getListOfFiles().pipe(take(1)).subscribe((data: any) => {
      this.uploadedFiles = data;
    });
  }

  mapToRDF(file: string) {
    this.fpb.mapToRDF(file).pipe(take(1)).subscribe((data: any) => {
      console.log(data);
      this.connector.initializeService();
    });
  }



  deleteFile(file: string) {
    this.fpb.deleteFile(file).pipe(take(1)).subscribe((data: any) => {
      console.log(data);
      this.getListofFiles()
    });
  }


}
