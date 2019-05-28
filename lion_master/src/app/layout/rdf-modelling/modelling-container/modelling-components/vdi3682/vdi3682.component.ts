import { Component, OnInit } from '@angular/core';
import { SparqlQueriesService } from '../../../rdf-models/services/sparql-queries.service';
import { Vdi3682ModelService, VDI3682DATA, VDI3682VARIABLES, VDI3682INSERT } from '../../../rdf-models/vdi3682Model.service';
import { PrefixesService } from '../../../rdf-models/services/prefixes.service';
import { Tables } from '../../../utils/tables';
import { DownloadService } from '../../../rdf-models/services/download.service';



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
    private modelService: Vdi3682ModelService
  ) { }



  ngOnInit() {
    this.allProcessInfo = this.modelService.getALL_PROCESS_INFO_TABLE();
    this.allClasses = this.modelService.getLIST_OF_ALL_CLASSES();
    this.setTableDescription();
    // this.query.select(this.modelData.allClasses).subscribe((data: any) => {
    //   // parse prefixes where possible 
    //   this.namespaceParser.parseToPrefix(data);
    //   this.allClasses = this.TableUtil.buildTable(data);
    // });
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
    // var insertString = this.modelInsert.createEntity(this.modelVariables.simpleStatement)
    // this.query.insert(insertString).subscribe((data: any) => {
    //   this.loadAllProcessInfo();
    //   this.loadStatisticInfo();
    // });
    this.modelService.insertTripel(this.modelVariables.simpleStatement).subscribe((data: any) => {
        this.loadAllProcessInfo();
        this.loadStatisticInfo();
      });
  }




  // iriTableClick(name: string) {
  //   this.selectedSubject = name;
  //   this.query.select(this.modelData.selectClass(this.selectedSubject)).subscribe((data: any) => {
  //     var owlClass = data.results.bindings[0].Class.value
  //     console.log(owlClass)

  //     this.query.select(this.modelData.selectPredicateByDomain(owlClass)).subscribe((data: any) => {
  //       // log + assign data and stop loader
  //       console.log(data);
  //       this.existingPredicates = data;
  //       // parse prefixes where possible 
  //       this.namespaceParser.parseToPrefix(data);
  //     });

  //   });

  // }
  iriTableClick(name: string) {
    this.selectedSubject = name;

    this.modelService.loadLIST_OF_CLASS_MEMBERSHIP(this.selectedSubject).subscribe((data: any) => {
      var owlClass = data[0];
      this.modelService.loadLIST_OF_PREDICATES_BY_DOMAIN(owlClass).subscribe((data: any) => {
        this.existingPredicates = data;
      });
    });

  }
  // getObjectClasses() {
  //   if (this.selectedPredicate) {
  //     var predicate = this.selectedPredicate;
  //     this.query.select(this.modelData.selectClassByRange(predicate)).subscribe((data: any) => {
  //       // log + assign data and stop loader
  //       console.log(data);
  //       this.existingObjectClasses = data;
  //       // parse prefixes where possible 
  //       this.namespaceParser.parseToPrefix(data);
  //     });
  //   }
  // }
  getObjectClasses() {
    if (this.selectedPredicate) {
      var predicate = this.selectedPredicate;
      this.modelService.loadLIST_OF_CLASSES_BY_RANGE(predicate).subscribe((data: any) => {
        this.existingObjectClasses = data;
      });
    }
  }
  // getExistingObjects() {
  //   if (this.selectedObjectClass) {
  //     var owlClass = this.selectedObjectClass
  //     this.query.select(this.modelData.selectIndividualByClass(owlClass)).subscribe((data: any) => {
  //       // log + assign data and stop loader
  //       console.log(data);
  //       this.existingObjects = data;
  //       // parse prefixes where possible 
  //       this.namespaceParser.parseToPrefix(data);
  //     });
  //   }
  // }
  getExistingObjects() {
    if (this.selectedObjectClass) {
      var owlClass = this.selectedObjectClass
      this.modelService.loadLIST_OF_INDIVIDUALS_BY_CLASS(owlClass).subscribe((data: any) => {
        this.existingObjects = data;
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
      });
  }

  // getAllProcessInfo() {
  //   this.query.select(this.modelData.allProcessInfo).subscribe((data: any) => {
  //     this.namespaceParser.parseToPrefix(data);
  //     this.allProcessInfo = this.TableUtil.buildTable(data);
  //     console.log(this.allProcessInfo)
  //     // parse prefixes where possible 
  //   });
  // }

  loadAllProcessInfo() {
    this.modelService.loadALL_PROCESS_INFO_TABLE().subscribe((data: any) => {
      this.allProcessInfo = data
      this.modelService.setALL_PROCESS_INFO_TABLE(this.allProcessInfo)
    });
  }


  // getStatisticInfo() {
  //   // get stats of functions in TS
  //   this.query.select(this.modelData.NoOfProcesses).subscribe((data: any) => {
  //     this.namespaceParser.parseToPrefix(data);
  //     this.NoOfProcesses = this.TableUtil.buildTable(data).length;
  //   });
  //   this.query.select(this.modelData.NoOfInOuts).subscribe((data: any) => {
  //     this.namespaceParser.parseToPrefix(data);
  //     this.NoOfInOuts = this.TableUtil.buildTable(data).length;
  //   });
  //   this.query.select(this.modelData.NoOfTechnicalResources).subscribe((data: any) => {
  //     this.namespaceParser.parseToPrefix(data);
  //     this.NoOfTechnicalResources = this.TableUtil.buildTable(data).length;
  //   });
  // }

  getStatisticInfo() {
    // get stats of functions in TS
    this.NoOfProcesses = this.modelService.getLIST_OF_PROCESSES().length;
    this.NoOfInOuts = this.modelService.getLIST_OF_INPUTS_AND_OUTPUTS().length;
    this.NoOfTechnicalResources = this.modelService.getLIST_OF_TECHNICAL_RESOURCES().length;
  }

  loadStatisticInfo() {
    this.modelService.loadLIST_OF_PROCESSES().subscribe((data: any) => {
      this.NoOfProcesses = data.length
      this.modelService.setLIST_OF_PROCESSES(data)
    });
    this.modelService.loadLIST_OF_INPUTS_AND_OUTPUTS().subscribe((data: any) => {
      this.NoOfInOuts = data.length
      this.modelService.setLIST_OF_INPUTS_AND_OUTPUTS(data)
    });
    this.modelService.loadLIST_OF_TECHNICAL_RESOURCES().subscribe((data: any) => {
      this.NoOfTechnicalResources = data.length
      this.modelService.setLIST_OF_TECHNICAL_RESOURCES(data)
    });
  }

  setTableDescription() {
    this.tableTitle = "Available Processes in Database";
    this.tableSubTitle = "Click on a cell to to use it for further descriptions.";
  }
}


