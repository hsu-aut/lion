import { Component, OnInit } from '@angular/core';
import { Vdi2206ModelService, VDI2206INSERT, VDI2206VARIABLES } from '../rdf-models/vdi2206Model.service';
import { DownloadService } from '../../shared/services/backEnd/download.service';

import { DataLoaderService } from '../../shared/services/dataLoader.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-vdi2206',
  templateUrl: './vdi2206.component.html',
  styleUrls: ['../../app.component.scss','./vdi2206.component.scss']
})
export class Vdi2206Component implements OnInit {

  // util variables
  keys = Object.keys;
  currentTable: Array<Object> = [];
  _currentOption: string;

  // stats 
  NoOfSystems: number;
  NoOfModules: number;
  NoOfComponents: number;

  // model data
  modelInsert = new VDI2206INSERT();
  modelVariables = new VDI2206VARIABLES();

  // graph db data
  allStructureInfoContainmentbySys: any = [];
  allStructureInfoContainmentbyMod: any = [];
  allStructureInfoContainmentbyCOM: any = [];
  allStructureInfoInheritancebySys: any = [];
  allStructureInfoInheritancebyMod: any = [];
  allStructureInfoInheritancebyCOM: any = [];
  allClasses: any;
  allPatternComment: any;

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

  StructureOptions: string;

  constructor(
    private dlService: DownloadService,
    private vdi2206Service: Vdi2206ModelService,
    private loadingScreenService: DataLoaderService
    ) { 
      
    }

  ngOnInit() {
    this.allClasses = this.vdi2206Service.getLIST_OF_CLASSES();
    this.getAllStructuralInfo();
    this.getStatisticInfo();
    this._currentOption = 'System_BUTTON';
    this.setTableOption(this._currentOption);
  }



  buildInsert(structureOption) {
    var triples = this.getTriples(structureOption);
    var insertString = this.vdi2206Service.buildTripel(triples);
    const blob = new Blob([insertString], { type: 'text/plain' });
    const name = 'insert.txt';
    this.dlService.download(blob, name);
  }
  executeInsert(structureOption) {
    var triples = this.getTriples(structureOption);
    console.log(triples);
    this.vdi2206Service.insertTripel(triples).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.setAllStructuralInfo();
      this.setStatisticInfo();
      this.selectedPredicate = undefined;
      this.selectedObjectClass = undefined;
      this.selectedObject = undefined;
      this.existingObjectClasses = undefined;
      this.existingObjects = undefined;
    });
  }

  getObjectClasses() {
    if (this.selectedPredicate) {

      var predicate = this.selectedPredicate;
      this.vdi2206Service.loadLIST_OF_CLASSES_BY_RANGE(predicate).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.existingObjectClasses = data;
        this.selectedObjectClass = data[0];
      });
    }
  }


  getExistingObjects() {

    if (this.selectedObjectClass) {
      var owlClass = this.selectedObjectClass
      this.vdi2206Service.loadLIST_OF_INDIVIDUALS_BY_CLASS(owlClass).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.existingObjects = data;
        this.selectedObject = data[0];
      });
    } else if (this.StructureOptions == "existingIndiInheritance" && this.selectedPredicate != undefined) {
      var subject = this.selectedSubject;
      this.vdi2206Service.loadLIST_OF_CLASS_MEMBERSHIP(subject).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        var owlClass = data[0];
        this.vdi2206Service.loadLIST_OF_INDIVIDUALS_BY_CLASS(owlClass).pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.existingObjects = data;
          this.selectedObject = data[0];
        });
      });
    }
  }

  tableClick(name: string) {
    this.selectedSubject = name;
    this.vdi2206Service.loadLIST_OF_CLASS_MEMBERSHIP(this.selectedSubject).pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      var owlClass = data[0];
      this.vdi2206Service.loadLIST_OF_PREDICATES_BY_DOMAIN(owlClass).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.existingPredicates = data;
        this.selectedPredicate = data[0];
      });
    });
  }


  getAllStructuralInfo() {
    //get containment info for sys
    this.allStructureInfoContainmentbySys = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS();
    this.allStructureInfoContainmentbyMod = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD();
    this.allStructureInfoContainmentbyCOM = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM();
    this.allStructureInfoInheritancebySys = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS();
    this.allStructureInfoInheritancebyMod = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD();
    this.allStructureInfoInheritancebyCOM = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM();
  }
  
  setAllStructuralInfo() {
    //set containment info for sys
    this.vdi2206Service.loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allStructureInfoContainmentbySys = data;
      this.vdi2206Service.setTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS(data);
      this.setTableOption(this._currentOption);
    });
    this.vdi2206Service.loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allStructureInfoContainmentbyMod = data;
      this.vdi2206Service.setTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD(data);
      this.setTableOption(this._currentOption);
    });
    this.vdi2206Service.loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allStructureInfoContainmentbyCOM = data;
      this.vdi2206Service.setTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM(data);
      this.setTableOption(this._currentOption);
    });
    this.vdi2206Service.loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allStructureInfoInheritancebySys = data;
      this.vdi2206Service.setTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS(data);
      this.setTableOption(this._currentOption);
    });
    this.vdi2206Service.loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allStructureInfoInheritancebyMod = data;
      this.vdi2206Service.setTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD(data);
      this.setTableOption(this._currentOption);
    });
    this.vdi2206Service.loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allStructureInfoInheritancebyCOM = data;
      this.vdi2206Service.setTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM(data);
      this.setTableOption(this._currentOption);
    });
  }

  getStatisticInfo() {
        // get stats of structure in TS
    this.NoOfSystems = this.vdi2206Service.getLIST_OF_SYSTEMS().length
    this.NoOfModules = this.vdi2206Service.getLIST_OF_MODULES().length
    this.NoOfComponents = this.vdi2206Service.getLIST_OF_COMPONENTS().length
  }
  setStatisticInfo() {
    // set stats of structure in TS
    this.vdi2206Service.loadLIST_OF_SYSTEMS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfSystems = data.length;
      this.vdi2206Service.setLIST_OF_SYSTEMS(data);
    });
    this.vdi2206Service.loadLIST_OF_MODULES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfModules = data.length;
      this.vdi2206Service.setLIST_OF_MODULES(data);
    });
    this.vdi2206Service.loadLIST_OF_COMPONENTS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfComponents = data.length;
      this.vdi2206Service.setLIST_OF_COMPONENTS(data);
    });

  }
  setTableOption(StructureTable: string) {

    switch (StructureTable) {
      case "System_BUTTON": {
        if(this.StructureOptions == "existingIndiInheritance"){this.currentTable = this.allStructureInfoInheritancebySys;}
        else {this.currentTable = this.allStructureInfoContainmentbySys;}
        this._currentOption = StructureTable;
        break;
      }
      case "Module_BUTTON": {
        if(this.StructureOptions == "existingIndiInheritance"){this.currentTable = this.allStructureInfoInheritancebyMod;}
        else {this.currentTable = this.allStructureInfoContainmentbyMod;}
        this._currentOption = StructureTable;
        break;
      }
      case "Component_BUTTON": {
        if(this.StructureOptions == "existingIndiInheritance"){this.currentTable = this.allStructureInfoInheritancebyCOM;}
        else {this.currentTable = this.allStructureInfoContainmentbyCOM;}
        this._currentOption = StructureTable;
        break;
      }
      default: {
        // no default statements
        break;
      }
    }
  }

  //  todo -> implement delete
  deleteValue() {

  }

  getTriples(structureOption: string) {
    if (structureOption == "newIndi") {
      this.modelVariables.simpleStatement = {
        subject: this.newSubject,
        predicate: this.newPredicate,
        object: this.selectedClass,
      }
    } else if (structureOption == "existingIndiInheritance") {
      this.modelVariables.simpleStatement = {
        subject: this.selectedSubject,
        predicate: this.selectedPredicate,
        object: this.selectedObject,
      }
    } else if (structureOption == "existingIndiContain") {
      this.modelVariables.simpleStatement = {
        subject: this.selectedSubject,
        predicate: this.selectedPredicate,
        object: this.selectedObject,
      }
    }
    return this.modelVariables.simpleStatement
  }

  setBack() {
    this.selectedSubject = undefined;
    this.selectedPredicate = undefined;
    this.selectedObject = undefined;
  }

  setStructureOption(option: string){
    this.StructureOptions = option;
    this.setTableOption(this._currentOption);
  }



}
