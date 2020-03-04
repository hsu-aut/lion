import { Component, OnInit } from '@angular/core';
import { StepServiceService } from './step-service.service';
import { take } from 'rxjs/operators';

import { FpbStepService } from '../connectors/fpb-step/fpb-step.service';
import { MessagesService } from '../../shared/services/messages.service';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {

  private stepURL = this.step.stepRoute;
  private assemblyStructure = {  }
  private uploadedFiles = ["asdasdsad"]
  private fileType = [".stp"]

  constructor(
    private step: StepServiceService,
    private connector: FpbStepService,
    private messageService: MessagesService
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
    this.messageService.addMessage('warning', 'Alright!', `The Backend started processing the file, that may take a while...`);
    this.step.mapToRDF(file).pipe(take(1)).subscribe((data: any) => {
      console.log(data);
      this.connector.initializeService();
    });
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
