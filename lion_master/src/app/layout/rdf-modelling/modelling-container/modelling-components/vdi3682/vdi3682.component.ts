import { Component, OnInit } from '@angular/core';
import { SparqlQueriesService } from '../../../rdf-models/services/sparql-queries.service';
import { Vdi3682ModelService, VDI3682DATA, VDI3682VARIABLES, VDI3682INSERT } from '../../../rdf-models/vdi3682Model.service';
import { PrefixesService } from '../../../rdf-models/services/prefixes.service';
import { Tables } from '../../../utils/tables';
import { DownloadService } from '../../../rdf-models/services/download.service';

import { DataLoaderService } from '../../../../../shared/services/dataLoader.service';



@Component({
  selector: 'app-vdi3682',
  templateUrl: './vdi3682.component.html',
  styleUrls: ['./vdi3682.component.scss'],
})
export class VDI3682Component implements OnInit {
  // util variables
  keys = Object.keys;
  TableUtil = new Tables();
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
  allProcessInfo: any = [];
  allClasses: any;

  //user input variables
  newSubject: string;
  newPredicate: string = "rdf:type";
  newObject: string;
  selectedClass: string;
  selectedSubject: string;
  selectedPredicate: string;
  selectedObject: string;
  selectedObjectClass: string;
  existingObjectClasses: Array<string>;
  existingPredicates: Array<string>;
  existingObjects: Array<string>;
  insertUrl;


  constructor(
    private query: SparqlQueriesService,
    private dlService: DownloadService,
    private namespaceParser: PrefixesService,
    private modelService: Vdi3682ModelService,
    private loadingScreenService: DataLoaderService
  ) { }



  ngOnInit() {
    this.allProcessInfo = this.modelService.getALL_PROCESS_INFO_TABLE();
    this.allClasses = this.modelService.getLIST_OF_ALL_CLASSES();
    this.setTableDescription();
    this.getStatisticInfo();


  }


  buildInsert() {

    this.modelVariables.simpleStatement = {
      subject: this.newSubject,
      predicate: this.newPredicate,
      object: this.selectedClass

    };
    var insertString = this.modelService.buildTripel(this.modelVariables.simpleStatement);
    const blob = new Blob([insertString], { type: 'text/plain' });
    const name = 'insert.txt';
    this.dlService.download(blob, name);
  }

  buildInsertRelations() {

    this.modelVariables.simpleStatement = {
      subject: this.selectedSubject,
      predicate: this.selectedPredicate,
      object: this.selectedObject,
    }
    var insertString = this.modelService.buildTripel(this.modelVariables.simpleStatement);
    const blob = new Blob([insertString], { type: 'text/plain' });
    // Dateiname
    const name = 'vdi3682Insert.txt';
    this.dlService.download(blob, name);
  }

  executeInsertEntities() {

    this.modelVariables.simpleStatement = {
      subject: this.newSubject,
      predicate: this.newPredicate,
      object: this.selectedClass,
    }

    this.modelService.insertTripel(this.modelVariables.simpleStatement).subscribe((data: any) => {
        this.loadAllProcessInfo();
        this.loadStatisticInfo();
      });
  }


  iriTableClick(name: string) {
    this.selectedSubject = name;

    this.modelService.loadLIST_OF_CLASS_MEMBERSHIP(this.selectedSubject).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      var owlClass = data[0];
      this.modelService.loadLIST_OF_PREDICATES_BY_DOMAIN(owlClass).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.existingPredicates = data;
        this.selectedPredicate = data[0];
      });
    });

  }

  getObjectClasses(predicate: string) {
    this.selectedObject = undefined;
    if (predicate) {
      this.modelService.loadLIST_OF_CLASSES_BY_RANGE(predicate).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.existingObjectClasses = data;
        this.selectedObjectClass = data[0]
      });
    }
  }

  getExistingObjects(owlClass: string) {
    if (owlClass) {
      this.modelService.loadLIST_OF_INDIVIDUALS_BY_CLASS(owlClass).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.existingObjects = data;
        this.selectedObject = data[0];
      });
    }
  }



  executeInsertRelations() {

    this.modelVariables.simpleStatement = {
      subject: this.selectedSubject,
      predicate: this.selectedPredicate,
      object: this.selectedObject,
    }
    this.modelService.insertTripel(this.modelVariables.simpleStatement).subscribe((data: any) => {
        this.loadAllProcessInfo();
        this.loadStatisticInfo();
        this.selectedPredicate = undefined;
        this.selectedObjectClass = undefined;
        this.selectedObject = undefined;
        this.existingObjectClasses = undefined;
        this.existingObjects = undefined;
      });
  }


  loadAllProcessInfo() {
    this.modelService.loadALL_PROCESS_INFO_TABLE().subscribe((data: any) => {
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
    this.modelService.loadLIST_OF_PROCESSES().subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfProcesses = data.length
      this.modelService.setLIST_OF_PROCESSES(data)
    });
    this.modelService.loadLIST_OF_INPUTS_AND_OUTPUTS().subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfInOuts = data.length
      this.modelService.setLIST_OF_INPUTS_AND_OUTPUTS(data)
    });
    this.modelService.loadLIST_OF_TECHNICAL_RESOURCES().subscribe((data: any) => {
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


