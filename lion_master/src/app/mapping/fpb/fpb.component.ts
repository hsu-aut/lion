import { Component, OnInit } from '@angular/core';
import { FpbService } from './fpb.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-fpb',
  templateUrl: './fpb.component.html',
  styleUrls: ['./fpb.component.scss']
})
export class FpbComponent implements OnInit {

  private fpbURL = this.fpb.fpbRoute;
  private fpbJSON = {}
  private uploadedFiles = ["Do you have a connection to the backend?"]
  private fileType = [".json"]

  constructor(
    private fpb: FpbService
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
    });
  }



  deleteFile(file: string) {
    this.fpb.deleteFile(file).pipe(take(1)).subscribe((data: any) => {
      console.log(data);
      this.getListofFiles()
    });
  }


}
