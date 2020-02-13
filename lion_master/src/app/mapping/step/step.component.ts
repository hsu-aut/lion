import { Component, OnInit } from '@angular/core';
import { StepServiceService } from './step-service.service';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {

  private stepURL = "/step";
  private assemblyStructure = {  }
  private uploadedFiles = ["asdasdsad"]
  private fileType = [".stp"]

  constructor(
    private step: StepServiceService
  ) { }

  ngOnInit() {
    this.getListofFiles();
  }

  getListofFiles() {
    this.step.getListOfFiles().pipe(take(1)).subscribe((data: any) => {
      this.uploadedFiles = data;
    });
  }

  mapToRDF(file: string) {

  }

  mapModifiedToRDF(file: string) {

  }

  deleteFile(file: string) {
    this.step.deleteFile(file).pipe(take(1)).subscribe((data: any) => {
      console.log(data);
      this.getListofFiles()
    });

  }

  loadJson(file){
    this.step.getJson(file).pipe(take(1)).subscribe((data: any) => {
      this.assemblyStructure = data;
    });
  }



}
