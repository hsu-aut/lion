import { Component, OnInit } from '@angular/core';
import { SparqlQueriesService } from '../../../rdf-models/services/sparql-queries.service';
import { Iso22400_2ModelService, ISO22400_2VARIABLES } from '../../../../rdf-modelling/rdf-models/iso22400_2Model.service';
import { Vdi2206ModelService } from '../../../../rdf-modelling/rdf-models/vdi2206Model.service';
import { Vdi3682ModelService } from '../../../../rdf-modelling/rdf-models/vdi3682Model.service';
import { DataLoaderService } from '../../../../../shared/services/dataLoader.service';
import { Tables } from '../../../utils/tables';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-iso22400-2',
  templateUrl: './iso22400-2.component.html',
  styleUrls: ['./iso22400-2.component.scss']
})
export class Iso22400_2Component implements OnInit {
  // util variables
  tableUtil = new Tables();
  keys = Object.keys;
  currentTable: Array<Object> = [];
  _currentTableOption: string = "VDI_BUTTON";
  tableTitle: string;
  tableSubTitle: string;


  // stats 
  NoOfKPIs: number;
  NoOfElements: number;
  NoOfEntities: number;

  // model data
  elementVariables = new ISO22400_2VARIABLES().simpleElement;
  KPIVariables = new ISO22400_2VARIABLES().KPI;

  // graph db data
  elementGroups: Array<string> = [];
  KPIGroups: Array<string> = [];
  allElementClassesPerGroup: Array<string> = [];
  allKPIClassesPerGroup: Array<string> = [];
  possibleTiming: Array<string> = [];
  organizationalElementClasses: Array<string> = [];
  allVDIInfo: Array<Object> = [];
  allIsoEntityInfo: Array<Object> = [];


  //user input variables
  newElementName: string;
  newPeriod: string;
  newUnitOfMeasure: string;
  newDuration: string;
  newKPIName: string;
  newSimpleValue: string;
  describedEntityName: string;
  selectedElementGroup: string;
  selectedElementClass: string;
  selectedEntityClass: string;
  selectedKPIGroup: string;
  selectedKPIClass: string;
  selectedTiming: string;

  // conditionals
  anyValueReadOnly: boolean = false;
  timeValueReadOnly: boolean = false;

  constructor(
    private isoService: Iso22400_2ModelService,
    private loadingScreenService: DataLoaderService,
    private vdi2206Service: Vdi2206ModelService,
    private vdi3682Service: Vdi3682ModelService
  ) { }

  ngOnInit() {
    this.getDropwDownInfo();
    this.getAllStatistics();
    this.getAllEntityInfo();
    this.setTableOption(this._currentTableOption);
  }

  getDropwDownInfo() {
    this.elementGroups = this.isoService.getLIST_OF_ELEMENT_GROUPS();
    this.KPIGroups = this.isoService.getLIST_OF_KPI_GROUPS();
    this.organizationalElementClasses = this.isoService.getLIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES();
  }

  loadClassesElement(selectedElementGroup) {
    if (selectedElementGroup) {
      this.isoService.loadLIST_OF_ELEMENTS_BY_GROUP(selectedElementGroup).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.allElementClassesPerGroup = data;
        this.selectedElementClass = this.allElementClassesPerGroup[0];
        this.setValueVisibility(this.selectedElementClass);
      });
    }
  }
  loadClassesKPI(selectedKPIGroup) {
    if (selectedKPIGroup) {
      this.isoService.loadLIST_OF_ELEMENTS_BY_GROUP(selectedKPIGroup).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.allKPIClassesPerGroup = data;
        this.selectedKPIClass = this.allKPIClassesPerGroup[0];
      });
    }
  }

  loadTimingConstraint(KPI_Class) {
    if (KPI_Class) {
      let ConstraingDataProperty = "http://www.hsu-ifa.de/ontologies/ISO22400-2#Timing"
      this.isoService.loadLIST_OF_CLASS_CONSTRAINT_ENUM(KPI_Class, ConstraingDataProperty).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.possibleTiming = data;
        this.selectedTiming = this.possibleTiming[0];
      });
    }
  }

  setValueVisibility(selectedElementClass: string) {
    if (selectedElementClass.search("Time") != -1) {
      this.timeValueReadOnly = true;
      this.anyValueReadOnly = false;
    } else {
      this.timeValueReadOnly = false;
      this.anyValueReadOnly = true;
    }
  }

  createTripel(execute: boolean, option: string) {
    if (option == "element") {
      this.elementVariables = {
        elementIRI: this.newElementName,
        elementClass: this.selectedElementClass,
        entityIRI: this.describedEntityName,
        entityClass: this.selectedEntityClass,
        relevantPeriod: this.newPeriod,
        UnitOfMeasure: this.newUnitOfMeasure,
        duration: this.newDuration,
        simpleValue: this.newSimpleValue
      }

      this.isoService.createElement(this.elementVariables, execute).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.loadAllStatistics();
        this.loadISOEntityInfo();
      });
    } else if (option == "KPI") {
      this.KPIVariables = {
        entityIRI: this.describedEntityName,
        entityClass: this.selectedEntityClass,
        KPI_IRI: this.newKPIName,
        KPI_Class: this.selectedKPIClass,
        timing: this.selectedTiming,
        relevantPeriod: this.newPeriod,
        UnitOfMeasure: this.newUnitOfMeasure,
        simpleValue: this.newSimpleValue,
      }
      this.isoService.createKPI(this.KPIVariables, execute).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.loadAllStatistics();
        this.loadISOEntityInfo();
      });
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
    this.describedEntityName = entityName;
  }

  getAllEntityInfo() {
    let cols = ["VDI2206:System", "VDI3682:TechnicalResource"]
    let data = [this.vdi2206Service.getLIST_OF_SYSTEMS(), this.vdi3682Service.getLIST_OF_TECHNICAL_RESOURCES()]
    this.allVDIInfo = this.tableUtil.concatListsToTable(cols, data)
    this.allIsoEntityInfo = this.isoService.getTABLE_ALL_ENTITY_INFO();
  }

  loadISOEntityInfo(){
    this.isoService.loadTABLE_ALL_ENTITY_INFO().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allIsoEntityInfo = data
      this.isoService.setTABLE_ALL_ENTITY_INFO(data)
    });
  }

  setTableOption(entityTable: string) {

    switch (entityTable) {
      case "VDI_BUTTON": {
        this.currentTable = this.allVDIInfo;
        this._currentTableOption = entityTable;
        break;
      }
      case "ISO_BUTTON": {
        this.currentTable = this.allIsoEntityInfo;
        this._currentTableOption = entityTable;
        break;
      }
      default: {
        // no default statements
        break;
      }
    }
  }

}
