import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { FpbStepService } from './fpb-step.service';
import { DataLoaderService } from '../../../shared/services/dataLoader.service';
import { MessagesService } from '../../../shared/services/messages.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-fpb-step',
  templateUrl: './fpb-step.component.html',
  styleUrls: ['./fpb-step.component.scss']
})
export class FpbStepComponent implements OnInit {

  // table var
  resourcesTable = [];
  // resourcesTitle: string = "Technical Resources";
  resourcesSubTitle: string = "FPD Technical Resources";
  filterOption: boolean = true;

  systemTable = [];
  // systemTitle: string = "TabelTitle!";
  systemSubTitle: string = "3D CAD assemblies";

  overviewSubTitle: string = "Connected individuals";
  overviewTable = [];

  // connection form
  newIndividualForm = this.fb.group({
    subject: [undefined, Validators.required],
    predicate: ['rdf:type'],
    object: [undefined, Validators.required],
  })


  constructor(
    private fb: FormBuilder,
    private dataService: FpbStepService,
    private loadingScreenService: DataLoaderService,
    private messageService: MessagesService,
  ) { }

  ngOnInit() {
    this.systemTable = this.dataService.getTABLE_OF_SYSTEM_INFO();
    this.resourcesTable = this.dataService.getTABLE_OF_TECHNICAL_RESOURCE_INFO();
    this.overviewTable = this.dataService.getTABLE_OVERVIEW();
  }

  resourceTableClick(row) {
    this.newIndividualForm.controls['subject'].setValue(row.ID);
  }

  systemTableClick(row) {
    this.newIndividualForm.controls['object'].setValue(row.ID);
  }

  modifyTripel(action: string, form: FormGroup) {
    let variables = {
      subject: "",
      object: ""
    }
    if (form.valid) {

      variables = {
        subject: form.controls['subject'].value,
        object: form.controls['object'].value
      }
      
      this.dataService.modifyTripel(variables, action).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.loadOverview()
      });

    } else if (form.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }
  }

  loadOverview() {
    this.dataService.loadTABLE_OVERVIEW().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.dataService.setTABLE_OVERVIEW(data);
      this.overviewTable = data;
    });
  }

}
