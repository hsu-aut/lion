import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Iso22400_2ModelService, ISO22400_2VARIABLES } from '../../layout/rdf-modelling/rdf-models/iso22400_2Model.service';
import { Vdi2206ModelService } from '../../layout/rdf-modelling/rdf-models/vdi2206Model.service';
import { Vdi3682ModelService } from '../../layout/rdf-modelling/rdf-models/vdi3682Model.service';
import { PrefixesService } from '../../shared/services/prefixes.service';
import { DataLoaderService } from '../../shared/services/dataLoader.service';
import { MessagesService } from '../../shared/services/messages.service';
import { Tables } from '../../layout/rdf-modelling/utils/tables';
import { take } from 'rxjs/operators';

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
  elementVariables = new ISO22400_2VARIABLES().simpleElement;
  KPIVariables = new ISO22400_2VARIABLES().KPI;

  // forms
  simpleElementForm = this.fb.group({
    elementGroup: [undefined, Validators.required],
    elementClass: [undefined, Validators.required],
    entity: [undefined, [Validators.required, Validators.pattern('([a-zA-Z0-9//:]){1,}')]],
    entityClass: [undefined, Validators.required],
    elementPeriod: [undefined, [Validators.required, Validators.pattern('[1-9][0-9]{3}-.+T[^.]+(Z|[+-].+)')]],
    value: [undefined],
    unitOfMeasure: [undefined],
    duration: [undefined, Validators.pattern('^(-?)P(?=.)(([0-9]*)Y)?(([0-9]+)M)?(([0-9]*)D)?(T(?=[0-9])([0-9]+H)?(([0-9]+)M)?(([0-9]+(?:\.[0-9]+))S)?)?$')],
  })
  KPIForm = this.fb.group({
    kpiGroup: [undefined, Validators.required],
    kpiClass: [undefined, Validators.required],
    entity: [undefined, [Validators.required, Validators.pattern('([a-zA-Z0-9//:]){1,}')]],
    entityClass: [undefined, Validators.required],
    kpiPeriod: [undefined, [Validators.required, Validators.pattern('[1-9][0-9]{3}-.+T[^.]+(Z|[+-].+)')]],
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
  allVDIInfo: Array<Object> = [];
  allIsoEntityInfo: Array<Object> = [];
  allIsoElementInfo: Array<Object> = [];
  allIsoKPIInfo: Array<Object> = [];

  // conditionals
  anyValueReadOnly: boolean = false;
  timeValueReadOnly: boolean = false;

  constructor(
    private fb: FormBuilder,
    private prefixService: PrefixesService,
    private isoService: Iso22400_2ModelService,
    private loadingScreenService: DataLoaderService,
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
      this.isoService.loadLIST_OF_ELEMENTS_BY_GROUP(selectedElementGroup).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.allElementClassesPerGroup = data;
      });
    }
  }
  loadClassesKPI(selectedKPIGroup) {
    if (selectedKPIGroup) {
      this.isoService.loadLIST_OF_ELEMENTS_BY_GROUP(selectedKPIGroup).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.allKPIClassesPerGroup = data;
      });
    }
  }

  loadTimingConstraint(KPI_Class) {
    if (KPI_Class) {
      let ConstraingDataProperty = "http://www.hsu-ifa.de/ontologies/ISO22400-2#Timing"
      this.isoService.loadLIST_OF_CLASS_CONSTRAINT_ENUM(KPI_Class, ConstraingDataProperty).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.possibleTiming = data;
      });
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

  createTripel(action: string, context: string, form: FormGroup) {
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
        }

        this.isoService.createElement(this.elementVariables, action).pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.loadAllStatistics();
          this.loadAllTableInfo();
          this.elementVariables = new ISO22400_2VARIABLES().simpleElement;
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
        }
        this.isoService.createKPI(this.KPIVariables, action).pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.loadAllStatistics();
          this.loadAllTableInfo();
          this.KPIVariables = new ISO22400_2VARIABLES().KPI;
        });
      }
    } else if (form.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }
  }

  getAllStatistics() {
    this.NoOfElements = this.isoService.getLIST_OF_NON_ORGANIZATIONAL_ELEMENTS().length;
    this.NoOfEntities = this.isoService.getLIST_OF_ORGANIZATIONAL_ELEMENTS().length;
    this.NoOfKPIs = this.isoService.getLIST_OF_KPIs().length;
  }

  loadAllStatistics() {
    this.isoService.loadLIST_OF_KPIs().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfKPIs = data.length
      this.isoService.setLIST_OF_KPIs(data)
    });
    this.isoService.loadLIST_OF_ORGANIZATIONAL_ELEMENTS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfEntities = data.length
      this.isoService.setLIST_OF_ORGANIZATIONAL_ELEMENTS(data)
    });
    this.isoService.loadLIST_OF_NON_ORGANIZATIONAL_ELEMENTS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfElements = data.length
      this.isoService.setLIST_OF_NON_ORGANIZATIONAL_ELEMENTS(data)
    });
  }

  tableClick(entityName: string) {
    this.simpleElementForm.controls['entity'].setValue(entityName);
    this.KPIForm.controls['entity'].setValue(entityName);
  }

  getAllTableInfo() {
    let cols = ["VDI2206:System", "VDI3682:TechnicalResource"]
    let data = [this.vdi2206Service.getLIST_OF_SYSTEMS(), this.vdi3682Service.getLIST_OF_TECHNICAL_RESOURCES()]
    this.allVDIInfo = this.tableUtil.concatListsToTable(cols, data)
    this.allIsoEntityInfo = this.isoService.getTABLE_ALL_ENTITY_INFO();
    this.allIsoElementInfo = this.isoService.getTABLE_ELEMENTS();
    this.allIsoKPIInfo = this.isoService.getTABLE_KPI();
  }

  loadAllTableInfo() {
    this.isoService.loadTABLE_ALL_ENTITY_INFO().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allIsoEntityInfo = data
      this.isoService.setTABLE_ALL_ENTITY_INFO(data)
    });
    this.isoService.loadTABLE_ELEMENTS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allIsoElementInfo = data
      this.isoService.setTABLE_ELEMENTS(data)
    });
    this.isoService.loadTABLE_KPI().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allIsoKPIInfo = data
      this.isoService.setTABLE_KPI(data)
    });
  }
  getDropwDownInfo() {
    this.elementGroups = this.isoService.getLIST_OF_ELEMENT_GROUPS();
    this.KPIGroups = this.isoService.getLIST_OF_KPI_GROUPS();
    this.organizationalElementClasses = this.isoService.getLIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES();
  }

}
