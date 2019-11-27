import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Vdi3682ModelService, VDI3682DATA, VDI3682VARIABLES, VDI3682INSERT } from '../../layout/rdf-modelling/rdf-models/vdi3682Model.service';
import { PrefixesService } from '../../shared/services/prefixes.service';

import { DataLoaderService } from '../../shared/services/dataLoader.service';
import { MessagesService } from '../../shared/services/messages.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-vdi3682',
  templateUrl: './vdi3682.component.html',
  styleUrls: ['../../app.component.scss', './vdi3682.component.scss'],
})
export class VDI3682Component implements OnInit {
  // util variables
  keys = Object.keys;
  tableTitle: string;
  tableSubTitle: string;

  // stats 
  NoOfProcesses: number;
  NoOfInOuts: number;
  NoOfTechnicalResources: number;

  // model data
  modelData = new VDI3682DATA();
  modelInsert = new VDI3682INSERT();
  modelVariables = new VDI3682VARIABLES();

  // graph db data
  allProcessInfo: Array<Object> = [];
  allClasses: Array<string> = [];
  existingObjectClasses: Array<string> = [];
  existingPredicates: Array<string> = [];
  existingObjects: Array<string> = [];

  // forms
  newIndividualForm = this.fb.group({
    name: [undefined, [Validators.required, Validators.pattern('(^((?!http).)*$)'), Validators.pattern('(^((?!://).)*$)')]],
    predicate: ['rdf:type'],
    type: [undefined, Validators.required],
  })

  newConnectionForm = this.fb.group({
    subject: [undefined, Validators.required],
    predicate: [undefined, Validators.required],
    objectClass: [undefined, Validators.required],
    object: [undefined, Validators.required],
  })

  constructor(
    private nameService: PrefixesService,
    private modelService: Vdi3682ModelService,
    private loadingScreenService: DataLoaderService,
    private messageService: MessagesService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.allProcessInfo = this.modelService.getALL_PROCESS_INFO_TABLE();
    this.allClasses = this.modelService.getLIST_OF_ALL_CLASSES();
    this.setTableDescription();
    this.getStatisticInfo();
  }

  modifyTripel(action: string, context: string, form: FormGroup) {
    if (form.valid) {
      switch (context) {
        case "newIndividual": {
          this.modelVariables.simpleStatement = {
            subject: this.nameService.addOrParseNamespace(form.controls['name'].value),
            predicate: this.nameService.parseToIRI(form.controls['predicate'].value),
            object: this.nameService.parseToIRI(form.controls['type'].value)
          };
          this.modelService.modifyTripel(this.modelVariables.simpleStatement, action).pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.loadAllProcessInfo();
            this.loadStatisticInfo();
            this.modelVariables = new VDI3682VARIABLES();
          });
          break;
        }
        case "connectIndividual": {
          this.modelVariables.simpleStatement = {
            subject: this.nameService.parseToIRI(form.controls['subject'].value),
            predicate: this.nameService.parseToIRI(form.controls['predicate'].value),
            object: this.nameService.parseToIRI(form.controls['object'].value)
          };
          this.modelService.modifyTripel(this.modelVariables.simpleStatement, action).pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.loadAllProcessInfo();
            this.loadStatisticInfo();
            this.modelVariables = new VDI3682VARIABLES();
          });
          break;
        }
      }
    } else if (form.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }
  }

  iriTableClick(name: string) {
    this.newConnectionForm.controls['subject'].setValue(name);

    this.modelService.loadLIST_OF_CLASS_MEMBERSHIP(this.newConnectionForm.controls['subject'].value).pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      var owlClass = data[0];
      this.modelService.loadLIST_OF_PREDICATES_BY_DOMAIN(owlClass).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.existingPredicates = data;
      });
    });

  }

  getObjectClasses(predicate: string) {
    if (predicate) {
      this.modelService.loadLIST_OF_CLASSES_BY_RANGE(predicate).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.existingObjectClasses = data;
      });
    }
  }

  getExistingObjects(owlClass: string) {
    if (owlClass) {
      this.modelService.loadLIST_OF_INDIVIDUALS_BY_CLASS(owlClass).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.existingObjects = data;
      });
    }
  }

  loadAllProcessInfo() {
    this.modelService.loadALL_PROCESS_INFO_TABLE().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allProcessInfo = data
      this.modelService.setALL_PROCESS_INFO_TABLE(this.allProcessInfo)
    });
  }


  getStatisticInfo() {
    // get stats of functions in TS
    this.NoOfProcesses = this.modelService.getLIST_OF_PROCESSES().length;
    this.NoOfInOuts = this.modelService.getLIST_OF_INPUTS_AND_OUTPUTS().length;
    this.NoOfTechnicalResources = this.modelService.getLIST_OF_TECHNICAL_RESOURCES().length;
  }

  loadStatisticInfo() {
    this.modelService.loadLIST_OF_PROCESSES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfProcesses = data.length
      this.modelService.setLIST_OF_PROCESSES(data)
    });
    this.modelService.loadLIST_OF_INPUTS_AND_OUTPUTS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfInOuts = data.length
      this.modelService.setLIST_OF_INPUTS_AND_OUTPUTS(data)
    });
    this.modelService.loadLIST_OF_TECHNICAL_RESOURCES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfTechnicalResources = data.length
      this.modelService.setLIST_OF_TECHNICAL_RESOURCES(data)
    });
  }

  setTableDescription() {
    this.tableTitle = "Available Processes in Database";
    this.tableSubTitle = "Click on a cell to to use it for further descriptions.";
  }
}


