import { Component, OnInit } from '@angular/core';
import { SparqlQueriesService} from '../../../rdf-models/services/sparql-queries.service';
import { Vdi2206ModelService, VDI2206INSERT, VDI2206VARIABLES } from '../../../rdf-models/vdi2206Model.service';
import { DownloadService } from '../../../rdf-models/services/download.service';

import { DataLoaderService } from '../../../../../shared/services/dataLoader.service';

@Component({
  selector: 'app-vdi2206',
  templateUrl: './vdi2206.component.html',
  styleUrls: ['./vdi2206.component.scss']
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
  StructureView: string;

  constructor(
    private query: SparqlQueriesService, 
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


  buildInsert() {
    var triples = this.getTriples(this.StructureOptions);
    var insertString = this.vdi2206Service.buildTripel(triples);
    const blob = new Blob([insertString], { type: 'text/plain' });
    const name = 'insert.txt';
    this.dlService.download(blob, name);
  }
  executeInsert() {
    var triples = this.getTriples(this.StructureOptions);
    console.log(triples);
    this.vdi2206Service.insertTripel(triples).subscribe((data: any) => {
      this.setAllStructuralInfo();
      this.setStatisticInfo();
    });
  }

  // getObjectClasses() {
  //   if (this.selectedPredicate) {
  //     var predicate = this.selectedPredicate;
  //     this.query.select(this.modelData.selectClassByRange(predicate)).subscribe((data: any) => {
  //       // parse prefixes where possible 
  //       this.namespaceParser.parseToPrefix(data);
  //       this.existingObjectClasses = this.TableUtil.buildList(data, 0);
  //     });
  //   }
  // }
  getObjectClasses() {
    if (this.selectedPredicate) {
      var predicate = this.selectedPredicate;
      this.vdi2206Service.loadLIST_OF_CLASSES_BY_RANGE(predicate).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.existingObjectClasses = data;
      });
    }
  }


  getExistingObjects() {
    if (this.selectedObjectClass) {
      var owlClass = this.selectedObjectClass
      this.vdi2206Service.loadLIST_OF_INDIVIDUALS_BY_CLASS(owlClass).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.existingObjects = data;
      });
    } else if (this.StructureOptions == "existingEntitiesInheritance" && this.selectedPredicate != undefined) {
      var subject = this.selectedSubject;
      this.vdi2206Service.loadLIST_OF_CLASS_MEMBERSHIP(subject).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        var owlClass = data[0];
        this.vdi2206Service.loadLIST_OF_INDIVIDUALS_BY_CLASS(owlClass).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.existingObjects = data;
        });
      });
    }
  }
  // getExistingObjects() {
  //   if (this.selectedObjectClass) {
  //     var owlClass = this.selectedObjectClass
  //     this.query.select(this.modelData.selectIndividualByClass(owlClass)).subscribe((data: any) => {
  //       // parse prefixes where possible 
  //       this.namespaceParser.parseToPrefix(data);
  //       this.existingObjects = this.TableUtil.buildList(data, 0);
  //     });
  //   } else if (this.StructureOptions == "existingEntitiesInheritance" && this.selectedPredicate != undefined) {
  //     var subject = this.selectedSubject;
  //     this.query.select(this.modelData.selectClass(subject)).subscribe((data: any) => {
  //       var owlClass = data.results.bindings[0].Class.value
  //       this.query.select(this.modelData.selectIndividualByClass(owlClass)).subscribe((data: any) => {
  //         // parse prefixes where possible 
  //         this.namespaceParser.parseToPrefix(data);
  //         this.existingObjects = this.TableUtil.buildList(data, 0);
  //       });
  //     });
  //   }
  // }

  // iriTableClick(name: string) {
  //   this.selectedSubject = name;
  //   this.query.select(this.modelData.selectClass(this.selectedSubject)).subscribe((data: any) => {
  //     var owlClass = data.results.bindings[0].Class.value
  //     console.log(owlClass)

  //     this.query.select(this.modelData.selectPredicateByDomain(owlClass)).subscribe((data: any) => {
  //       // parse prefixes where possible 
  //       this.namespaceParser.parseToPrefix(data);
  //       this.existingPredicates = this.TableUtil.buildList(data, 0);
  //     });

  //   });
  // }
  tableClick(name: string) {
    this.selectedSubject = name;
    console.log(this.selectedSubject)
    this.vdi2206Service.loadLIST_OF_CLASS_MEMBERSHIP(this.selectedSubject).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      var owlClass = data[0];
      console.log(owlClass)
      this.vdi2206Service.loadLIST_OF_PREDICATES_BY_DOMAIN(owlClass).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.existingPredicates = data;
        console.log(data)
      });
    });
  }

  // getAllStructuralInfo() {
  //   //get containment info for sys
  //   this.query.select(this.modelData.allStructureInfoContainmentbySys).subscribe((data: any) => {
  //     // parse prefixes where possible 
  //     this.namespaceParser.parseToPrefix(data);
  //     this.allStructureInfoContainmentbySys = this.TableUtil.buildTable(data);
  //     this.renderTable(this.StructureView);
  //   });
  //   this.query.select(this.modelData.allStructureInfoContainmentbyMod).subscribe((data: any) => {
  //     // parse prefixes where possible 
  //     this.namespaceParser.parseToPrefix(data);
  //     this.allStructureInfoContainmentbyMod = this.TableUtil.buildTable(data);
  //     this.renderTable(this.StructureView);
  //   });
  //   this.query.select(this.modelData.allStructureInfoInheritancebySys).subscribe((data: any) => {
  //     // parse prefixes where possible 
  //     this.namespaceParser.parseToPrefix(data);
  //     this.allStructureInfoInheritancebySys = this.TableUtil.buildTable(data);
  //     this.renderTable(this.StructureView);
  //   });
  //   this.query.select(this.modelData.allStructureInfoInheritancebyMod).subscribe((data: any) => {
  //     // parse prefixes where possible 
  //     this.namespaceParser.parseToPrefix(data);
  //     this.allStructureInfoInheritancebyMod = this.TableUtil.buildTable(data);
  //     this.renderTable(this.StructureView);
  //   });

  // }
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
    this.vdi2206Service.loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS().subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allStructureInfoContainmentbySys = data;
      this.vdi2206Service.setTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS(data);
      this.setTableOption(this._currentOption);
    });
    this.vdi2206Service.loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD().subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allStructureInfoContainmentbyMod = data;
      this.vdi2206Service.setTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD(data);
      this.setTableOption(this._currentOption);
    });
    this.vdi2206Service.loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM().subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allStructureInfoContainmentbyCOM = data;
      this.vdi2206Service.setTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM(data);
      this.setTableOption(this._currentOption);
    });
    this.vdi2206Service.loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS().subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allStructureInfoInheritancebySys = data;
      this.vdi2206Service.setTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS(data);
      this.setTableOption(this._currentOption);
    });
    this.vdi2206Service.loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD().subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allStructureInfoInheritancebyMod = data;
      this.vdi2206Service.setTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD(data);
      this.setTableOption(this._currentOption);
    });
    this.vdi2206Service.loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM().subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allStructureInfoInheritancebyCOM = data;
      this.vdi2206Service.setTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM(data);
      this.setTableOption(this._currentOption);
    });
  }
  // getStatisticInfo() {
  //   // get stats of structure in TS
  //   this.query.select(this.modelData.NoOfSystems).subscribe((data: any) => {
  //     this.namespaceParser.parseToPrefix(data);
  //     this.NoOfSystems = this.TableUtil.buildTable(data).length;
  //   });
  //   this.query.select(this.modelData.NoOfModules).subscribe((data: any) => {
  //     this.namespaceParser.parseToPrefix(data);
  //     this.NoOfModules = this.TableUtil.buildTable(data).length;
  //   });
  //   this.query.select(this.modelData.NoOfComponents).subscribe((data: any) => {
  //     this.namespaceParser.parseToPrefix(data);
  //     this.NoOfComponents = this.TableUtil.buildTable(data).length;
  //   });
  // }
  getStatisticInfo() {
        // get stats of structure in TS
    this.NoOfSystems = this.vdi2206Service.getLIST_OF_SYSTEMS().length
    this.NoOfModules = this.vdi2206Service.getLIST_OF_MODULES().length
    this.NoOfComponents = this.vdi2206Service.getLIST_OF_COMPONENTS().length
  }
  setStatisticInfo() {
    // set stats of structure in TS
    this.vdi2206Service.loadLIST_OF_SYSTEMS().subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfSystems = data.length;
      this.vdi2206Service.setLIST_OF_SYSTEMS(data);
    });
    this.vdi2206Service.loadLIST_OF_MODULES().subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfModules = data.length;
      this.vdi2206Service.setLIST_OF_MODULES(data);
    });
    this.vdi2206Service.loadLIST_OF_COMPONENTS().subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfComponents = data.length;
      this.vdi2206Service.setLIST_OF_COMPONENTS(data);
    });

  }
  setTableOption(StructureTable: string) {

    switch (StructureTable) {
      case "System_BUTTON": {
        if(this.StructureOptions == "existingEntitiesInheritance"){this.currentTable = this.allStructureInfoInheritancebySys;}
        else {this.currentTable = this.allStructureInfoContainmentbySys;}
        this._currentOption = StructureTable;
        break;
      }
      case "Module_BUTTON": {
        if(this.StructureOptions == "existingEntitiesInheritance"){this.currentTable = this.allStructureInfoInheritancebyMod;}
        else {this.currentTable = this.allStructureInfoContainmentbyMod;}
        this._currentOption = StructureTable;
        break;
      }
      case "Component_BUTTON": {
        if(this.StructureOptions == "existingEntitiesInheritance"){this.currentTable = this.allStructureInfoInheritancebyCOM;}
        else {this.currentTable = this.allStructureInfoContainmentbyCOM;}
        this._currentOption = StructureTable;
        break;
      }
      default: {
        // no default statements
        break;
      }
    }

    // this.StructureView = StructureTable;
    // if (StructureTable == "System" && (this.StructureOptions == "newEntities" || this.StructureOptions == "existingEntitiesContainment")) {
    //   this.currentTable = this.allStructureInfoContainmentbySys;
    //   console.log(this.currentTable)
    // } else if (StructureTable == "Module" && (this.StructureOptions == "newEntities" || this.StructureOptions == "existingEntitiesContainment")) {
    //   this.currentTable = this.allStructureInfoContainmentbyMod;
    // } else if (StructureTable == "System" && this.StructureOptions == "existingEntitiesInheritance") {
    //   this.currentTable = this.allStructureInfoInheritancebySys;
    // } else if (StructureTable == "Module" && this.StructureOptions == "existingEntitiesInheritance") {
    //   this.currentTable = this.allStructureInfoInheritancebyMod;
    // } 

  }

  //  todo -> implement delete
  deleteValue() {

  }

  getTriples(structureOption: string) {
    if (structureOption == "newEntities") {
      this.modelVariables.simpleStatement = {
        subject: this.newSubject,
        predicate: this.newPredicate,
        object: this.selectedClass,
      }
    } else if (structureOption == "existingEntitiesInheritance") {
      this.modelVariables.simpleStatement = {
        subject: this.selectedSubject,
        predicate: this.selectedPredicate,
        object: this.selectedObject,
      }
    } else if (structureOption == "existingEntitiesContainment") {
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



}
