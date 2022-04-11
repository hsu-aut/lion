import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Iso22400_2ModelService, ISO224002Variables } from '../rdf-models/iso22400_2Model.service';
import { Vdi2206ModelService } from '../rdf-models/vdi2206Model.service';
import { Vdi3682ModelService } from '../rdf-models/vdi3682Model.service';
import { PrefixesService } from '../../shared/services/prefixes.service';
import { MessagesService } from '../../shared/services/messages.service';
import { Tables } from '../utils/tables';
import { take } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

@Component({
    selector: 'app-iso22400-2',
    templateUrl: './iso22400-2.component.html',
    styleUrls: ['../../app.component.scss', './iso22400-2.component.scss']
})
export class Iso22400_2Component implements OnInit {
  // util variables
  tableUtil = new Tables();
  keys = Object.keys;
  tableTitle: string;
  tableSubTitle: string;

  // stats
  NoOfKPIs: number;
  NoOfElements: number;
  NoOfEntities: number;

  // model data
  elementVariables = new ISO224002Variables().simpleElement;
  KPIVariables = new ISO224002Variables().KPI;

  // forms
  simpleElementForm = this.fb.group({
      elementGroup: [undefined, Validators.required],
      elementClass: [undefined, Validators.required],
      entity: [undefined, [Validators.required, Validators.pattern('([a-zA-Z0-9//:]){1,}')]],
      entityClass: [undefined, Validators.required],
      // elementPeriod: [undefined, [Validators.required, Validators.pattern('[1-9][0-9]{3}-.+T[^.]+(Z|[+-].+)')]],
      elementPeriod: [undefined, Validators.required],
      value: [undefined],
      unitOfMeasure: [undefined],
      // duration: [undefined, Validators.pattern('^(-?)P(?=.)(([0-9]*)Y)?(([0-9]+)M)?(([0-9]*)D)?(T(?=[0-9])([0-9]+H)?(([0-9]+)M)?(([0-9]+(?:\.[0-9]+))S)?)?$')],
      duration: [undefined],
  })
  KPIForm = this.fb.group({
      kpiGroup: [undefined, Validators.required],
      kpiClass: [undefined, Validators.required],
      entity: [undefined, [Validators.required, Validators.pattern('([a-zA-Z0-9//:]){1,}')]],
      entityClass: [undefined, Validators.required],
      kpiPeriod: [undefined, Validators.required],
      value: [undefined, Validators.required],
      unitOfMeasure: [undefined, Validators.required],
      timing: [undefined, Validators.required],
  })

  // graph db data
  elementGroups: Array<string> = [];
  KPIGroups: Array<string> = [];
  allElementClassesPerGroup: Array<string> = [];
  allKPIClassesPerGroup: Array<string> = [];
  possibleTiming: Array<string> = [];
  organizationalElementClasses: Array<string> = [];
  allVDIInfo: Array<Record<string, any>> = [];
  allIsoEntityInfo: Array<Record<string, any>> = [];
  allIsoElementInfo: Array<Record<string, any>> = [];
  allIsoKPIInfo: Array<Record<string, any>> = [];

  // conditionals
  anyValueReadOnly = false;
  timeValueReadOnly = false;

  constructor(
    private fb: FormBuilder,
    private prefixService: PrefixesService,
    private isoService: Iso22400_2ModelService,
    private vdi2206Service: Vdi2206ModelService,
    private vdi3682Service: Vdi3682ModelService,
    private messageService: MessagesService
  ) { }

  ngOnInit() {
      this.getDropwDownInfo();
      this.getAllStatistics();
      this.getAllTableInfo();
  }

  loadClassesElement(selectedElementGroup) {
    if (selectedElementGroup) {
        this.isoService.getListOfElementsByGroup(selectedElementGroup).subscribe((data: string[]) => this.allElementClassesPerGroup = data);
    }
  }
  loadClassesKPI(selectedKPIGroup) {
    if (selectedKPIGroup) {
      this.isoService.getListOfElementsByGroup(selectedKPIGroup).subscribe((data: string[]) => this.allElementClassesPerGroup = data);
    }
  }

  loadTimingConstraint(KPI_Class) {
      console.log(KPI_Class);
      if (KPI_Class) {
        // TODO getListOfClassConstraintEnum exists for this use case only - could ConstraingDataProperty also be a constant?
        const ConstraingDataProperty = "http://www.hsu-ifa.de/ontologies/ISO22400-2#Timing";
        this.isoService.getListOfClassConstraintEnum(KPI_Class, ConstraingDataProperty).subscribe((data: string[]) => this.possibleTiming = data);
      }
  }

  setValueVisibility(selectedElementClass: string) {
      if (selectedElementClass) {
          if (selectedElementClass.search("Time") != -1) {
              this.timeValueReadOnly = true;
              this.anyValueReadOnly = false;
              this.simpleElementForm.controls['value'].setValue(undefined);
              this.simpleElementForm.controls['unitOfMeasure'].setValue(undefined);
          } else {
              this.timeValueReadOnly = false;
              this.anyValueReadOnly = true;
              this.simpleElementForm.controls['duration'].setValue(undefined);
          }
      }

  }

  createTriple(action: string, context: string, form: FormGroup) {
      if (form.valid) {
          if (context == "element") {
              this.elementVariables = {
                  elementIRI: this.prefixService.addOrParseNamespace(form.controls['entity'].value) + "_" + this.prefixService.parseToName(form.controls['elementClass'].value),
                  elementClass: this.prefixService.parseToIRI(form.controls['elementClass'].value),
                  entityIRI: this.prefixService.addOrParseNamespace(form.controls['entity'].value),
                  entityClass: this.prefixService.parseToIRI(form.controls['entityClass'].value),
                  relevantPeriod: form.controls['elementPeriod'].value,
                  UnitOfMeasure: form.controls['unitOfMeasure'].value,
                  duration: form.controls['duration'].value,
                  simpleValue: form.controls['value'].value,
              };

              this.isoService.createElement(this.elementVariables, action).pipe(take(1)).subscribe((data: any) => {
                  this.getAllStatistics();
                  this.getAllTableInfo();
                  this.elementVariables = new ISO224002Variables().simpleElement;
              });
          } else if (context == "KPI") {
              this.KPIVariables = {
                  entityIRI: this.prefixService.addOrParseNamespace(form.controls['entity'].value),
                  entityClass: this.prefixService.parseToIRI(form.controls['entityClass'].value),
                  KPI_IRI: this.prefixService.addOrParseNamespace(form.controls['entity'].value) + "_" + this.prefixService.parseToName(form.controls['kpiClass'].value),
                  KPI_Class: this.prefixService.parseToIRI(form.controls['kpiClass'].value),
                  timing: form.controls['timing'].value,
                  relevantPeriod: form.controls['kpiPeriod'].value,
                  UnitOfMeasure: form.controls['unitOfMeasure'].value,
                  simpleValue: form.controls['value'].value,
              };
              this.isoService.createKPI(this.KPIVariables, action).pipe(take(1)).subscribe((data: any) => {
                  this.getAllStatistics();
                  this.getAllTableInfo();
                  this.KPIVariables = new ISO224002Variables().KPI;
              });
          }
      } else if (form.invalid) {
          this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
      }
  }

  tableClick(entityName: string) {
      this.simpleElementForm.controls['entity'].setValue(entityName);
      this.KPIForm.controls['entity'].setValue(entityName);
  }

  getAllStatistics() {
    this.isoService.getListOfNonOrganizationalElements().subscribe((data: string[]) => this.NoOfElements = data.length);
    this.isoService.getListOfOrganizationalElements().subscribe((data: string[]) => this.NoOfEntities = data.length);
    this.isoService.getListOfKPIs().subscribe((data: string[]) => this.NoOfKPIs = data.length);
  }

  getAllTableInfo(): void {

    // wrap vdi2206Service.getLIST_OF_SYSTEMS() as observable for now
    // TODO: exchange with real observable, as soon as vdi2206Service is updated
    const vdi2206Observable: Observable<string[]> = new Observable(subscriber => {
        subscriber.next(this.vdi2206Service.getLIST_OF_SYSTEMS());
        subscriber.complete();
    });

    // create new observable of two observables which completes when each observable returns 1st output
    const combinedObservable: Observable<[string[], string[]]> = forkJoin([
        vdi2206Observable.pipe(take(1)),    // TODO: exchange this dummy with real observable
        this.vdi3682Service.getListOfTechnicalResources()
    ]);  

    // combine in one table as soon as combined observable completes
    combinedObservable.subscribe((data: [string[], string[]]) => {
        const cols: string[] = ["VDI2206:System", "VDI3682:TechnicalResource"]; 
        this.allVDIInfo = this.tableUtil.concatListsToTable(cols, data);
    });

    // remaining tables wihtout joins
    this.isoService.getTableOfAllEntityInfo().subscribe((data: Record<string, string>[]) => this.allIsoEntityInfo = data);
    this.isoService.getTableOfElements().subscribe((data: Record<string, string>[]) => this.allIsoElementInfo = data);
    this.isoService.getTableOfKPIs().subscribe((data: Record<string, string>[]) => this.allIsoKPIInfo = data);

  }

  getDropwDownInfo() {
    this.isoService.getListOfElementGroups().subscribe((data: string[]) => this.elementGroups = data);
    this.isoService.getListOfKPIGroups().subscribe((data: string[]) => this.KPIGroups = data);
    this.isoService.getListOfOrganizationalElementClasses().subscribe((data: string[]) => this.organizationalElementClasses = data);
  }

}
