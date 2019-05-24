import { Component, OnInit } from '@angular/core';
import { SparqlQueriesService} from '../../../rdf-models/services/sparql-queries.service';
import { VDI2206DATA, VDI2206INSERT, VDI2206VARIABLES } from '../../../rdf-models/vdi2206Model';
import { PrefixesService } from '../../../rdf-models/services/prefixes.service';
import { Tables } from '../../../utils/tables';
import { DownloadService } from '../../../rdf-models/services/download.service';

@Component({
  selector: 'app-vdi2206',
  templateUrl: './vdi2206.component.html',
  styleUrls: ['./vdi2206.component.scss']
})
export class Vdi2206Component implements OnInit {

  // util variables
  keys = Object.keys;
  TableUtil = new Tables();
  currentTable: Array<Object> = [];

  // stats 
  NoOfSystems: number;
  NoOfModules: number;
  NoOfComponents: number;

  // model data
  modelData = new VDI2206DATA();
  modelInsert = new VDI2206INSERT();
  modelVariables = new VDI2206VARIABLES();

  // graph db data
  allStructureInfoContainmentbySys: any = [];
  allStructureInfoContainmentbyMod: any = [];
  allStructureInfoInheritancebySys: any = [];
  allStructureInfoInheritancebyMod: any = [];
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
    private namespaceParser: PrefixesService
    ) { }

  ngOnInit() {
    this.query.select(this.modelData.allClasses).subscribe((data: any) => {
      // parse prefixes where possible 
      this.namespaceParser.parseToPrefix(data);
      this.allClasses = this.TableUtil.buildTable(data);
    });
    this.getAllStructuralInfo();
    this.getStatisticInfo();
  }


  buildInsert() {
    var triples = this.getTriples(this.StructureOptions);
    var insertString = this.modelInsert.createEntity(triples);
    const blob = new Blob([insertString], { type: 'text/plain' });
    const name = 'insert.txt';
    this.dlService.download(blob, name);
  }
  executeInsert() {
    var triples = this.getTriples(this.StructureOptions);
    console.log(triples);
    var insertString = this.modelInsert.createEntity(triples)
    this.query.insert(insertString).subscribe((data: any) => {
      this.getAllStructuralInfo();
      this.getStatisticInfo();
    });
  }

  getObjectClasses() {
    if (this.selectedPredicate) {
      var predicate = this.selectedPredicate;
      this.query.select(this.modelData.selectClassByRange(predicate)).subscribe((data: any) => {
        // parse prefixes where possible 
        this.namespaceParser.parseToPrefix(data);
        this.existingObjectClasses = this.TableUtil.buildList(data, 0);
      });
    }
  }

  getExistingObjects() {
    if (this.selectedObjectClass) {
      var owlClass = this.selectedObjectClass
      this.query.select(this.modelData.selectIndividualByClass(owlClass)).subscribe((data: any) => {
        // parse prefixes where possible 
        this.namespaceParser.parseToPrefix(data);
        this.existingObjects = this.TableUtil.buildList(data, 0);
      });
    } else if (this.StructureOptions == "existingEntitiesInheritance" && this.selectedPredicate != undefined) {
      var subject = this.selectedSubject;
      this.query.select(this.modelData.selectClass(subject)).subscribe((data: any) => {
        var owlClass = data.results.bindings[0].Class.value
        this.query.select(this.modelData.selectIndividualByClass(owlClass)).subscribe((data: any) => {
          // parse prefixes where possible 
          this.namespaceParser.parseToPrefix(data);
          this.existingObjects = this.TableUtil.buildList(data, 0);
        });
      });
    }
  }

  iriTableClick(name: string) {
    this.selectedSubject = name;
    this.query.select(this.modelData.selectClass(this.selectedSubject)).subscribe((data: any) => {
      var owlClass = data.results.bindings[0].Class.value
      console.log(owlClass)

      this.query.select(this.modelData.selectPredicateByDomain(owlClass)).subscribe((data: any) => {
        // parse prefixes where possible 
        this.namespaceParser.parseToPrefix(data);
        this.existingPredicates = this.TableUtil.buildList(data, 0);
      });

    });
  }

  getAllStructuralInfo() {
    //get containment info for sys
    this.query.select(this.modelData.allStructureInfoContainmentbySys).subscribe((data: any) => {
      // parse prefixes where possible 
      this.namespaceParser.parseToPrefix(data);
      this.allStructureInfoContainmentbySys = this.TableUtil.buildTable(data);
      this.renderTable(this.StructureView);
    });
    this.query.select(this.modelData.allStructureInfoContainmentbyMod).subscribe((data: any) => {
      // parse prefixes where possible 
      this.namespaceParser.parseToPrefix(data);
      this.allStructureInfoContainmentbyMod = this.TableUtil.buildTable(data);
      this.renderTable(this.StructureView);
    });
    this.query.select(this.modelData.allStructureInfoInheritancebySys).subscribe((data: any) => {
      // parse prefixes where possible 
      this.namespaceParser.parseToPrefix(data);
      this.allStructureInfoInheritancebySys = this.TableUtil.buildTable(data);
      this.renderTable(this.StructureView);
    });
    this.query.select(this.modelData.allStructureInfoInheritancebyMod).subscribe((data: any) => {
      // parse prefixes where possible 
      this.namespaceParser.parseToPrefix(data);
      this.allStructureInfoInheritancebyMod = this.TableUtil.buildTable(data);
      this.renderTable(this.StructureView);
    });

  }
  getStatisticInfo() {
    // get stats of structure in TS
    this.query.select(this.modelData.NoOfSystems).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.NoOfSystems = this.TableUtil.buildTable(data).length;
    });
    this.query.select(this.modelData.NoOfModules).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.NoOfModules = this.TableUtil.buildTable(data).length;
    });
    this.query.select(this.modelData.NoOfComponents).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.NoOfComponents = this.TableUtil.buildTable(data).length;
    });
  }
  renderTable(StructureTable: string) {
    this.StructureView = StructureTable;
    if (StructureTable == "System" && (this.StructureOptions == "newEntities" || this.StructureOptions == "existingEntitiesContainment")) {
      this.currentTable = this.allStructureInfoContainmentbySys;
    } else if (StructureTable == "Module" && (this.StructureOptions == "newEntities" || this.StructureOptions == "existingEntitiesContainment")) {
      this.currentTable = this.allStructureInfoContainmentbyMod;
    } else if (StructureTable == "System" && this.StructureOptions == "existingEntitiesInheritance") {
      this.currentTable = this.allStructureInfoInheritancebySys;
    } else if (StructureTable == "Module" && this.StructureOptions == "existingEntitiesInheritance") {
      this.currentTable = this.allStructureInfoInheritancebyMod;
    }

  }

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
