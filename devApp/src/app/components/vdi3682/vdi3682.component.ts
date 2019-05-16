import { Component, OnInit } from '@angular/core';
import { SparqlQueriesService} from '../../services/sparql-queries.service';
import { VDI3682DATA, VDI3682INSERT, VDI3682VARIABLES, tripel } from '../../models/vdi3682'
import { Namespace} from '../../utils/prefixes';
import { Tables } from '../../utils/tables'

import { DownloadService } from 'src/app/services/download.service';



@Component({
  selector: 'app-vdi3682',
  templateUrl: './vdi3682.component.html',
  styleUrls: ['./vdi3682.component.scss']
})
export class VDI3682Component implements OnInit {
  // util variables
  keys = Object.keys; 
  namespaceParser = new Namespace();
  TableUtil = new Tables();

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
  existingObjectClasses: string;
  existingPredicates: string;
  existingObjects: string;
  insertUrl;


  constructor(private query:SparqlQueriesService, private dlService: DownloadService) { }



  ngOnInit() {
    this.getAllProcessInfo();
    this.query.select(this.modelData.allClasses).subscribe((data: any) => {
        // parse prefixes where possible 
        this.namespaceParser.parseToPrefix(data);
        this.allClasses = this.TableUtil.buildTable(data);
        });
    this.getStatisticInfo();

        
  }


  buildInsert(){
    
    this.modelVariables.simpleStatement = {
      subject: this.newSubject,
      predicate: this.newPredicate,
      object: this.selectedClass

    };
    var insertString = this.modelInsert.createEntity(this.modelVariables.simpleStatement);
        // new: Hamied -> Download insertString as .txt file
        // Blob
    const blob = new Blob([insertString], { type: 'text/plain' });
        // Dateiname
    const name = 'insert.txt';
    this.dlService.download(blob, name);
    

  }
  executeInsertEntities(){
    
    this.modelVariables.simpleStatement = {
      subject: this.newSubject,
      predicate: this.newPredicate,
      object: this.selectedClass,
    }
    var insertString = this.modelInsert.createEntity(this.modelVariables.simpleStatement)
    this.query.insert(insertString).subscribe((data: any) => {
      console.log(data)
      this.getAllProcessInfo();
      this.getStatisticInfo();
    });
  }
  iriTableClick(name: string){
    this.selectedSubject = name;
    this.query.select(this.modelData.selectClass(this.selectedSubject)).subscribe((data: any) =>{
      var owlClass = data.results.bindings[0].Class.value
      console.log(owlClass)
      
      this.query.select(this.modelData.selectPredicateByDomain(owlClass)).subscribe((data: any) => {
        // log + assign data and stop loader
        console.log(data);
        this.existingPredicates = data;
        // parse prefixes where possible 
        this.namespaceParser.parseToPrefix(data);
        });

    });

  }
  getObjectClasses(){
    if(this.selectedPredicate){
        var predicate = this.selectedPredicate;
        this.query.select(this.modelData.selectClassByRange(predicate)).subscribe((data: any) => {
        // log + assign data and stop loader
        console.log(data);
        this.existingObjectClasses = data;
        // parse prefixes where possible 
        this.namespaceParser.parseToPrefix(data);
        });
    }
  }
  getExistingObjects(){
    if(this.selectedObjectClass){
        var owlClass = this.selectedObjectClass
        this.query.select(this.modelData.selectIndividualByClass(owlClass)).subscribe((data: any) => {
        // log + assign data and stop loader
        console.log(data);
        this.existingObjects = data;
        // parse prefixes where possible 
        this.namespaceParser.parseToPrefix(data);
        });
    }
  }
  executeInsertRelations(){
    
    this.modelVariables.simpleStatement = {
      subject: this.selectedSubject,
      predicate: this.selectedPredicate,
      object: this.selectedObject,
    }
    var insertString = this.modelInsert.createEntity(this.modelVariables.simpleStatement)
    this.query.insert(insertString).subscribe((data: any) => {
      console.log(data)
      this.getAllProcessInfo();
      this.getStatisticInfo();
    });

  }

  getAllProcessInfo(){
    this.query.select(this.modelData.allProcessInfo).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.allProcessInfo = this.TableUtil.buildTable(data);
      console.log(this.allProcessInfo)
    // parse prefixes where possible 
    });
  }
  getStatisticInfo(){
    // get stats of functions in TS
  this.query.select(this.modelData.NoOfProcesses).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.NoOfProcesses = this.TableUtil.buildTable(data).length;  
  });
  this.query.select(this.modelData.NoOfInOuts).subscribe((data: any) => {
    this.namespaceParser.parseToPrefix(data);
    this.NoOfInOuts = this.TableUtil.buildTable(data).length;  
  });
  this.query.select(this.modelData.NoOfTechnicalResources).subscribe((data: any) => {
    this.namespaceParser.parseToPrefix(data);
    this.NoOfTechnicalResources = this.TableUtil.buildTable(data).length;  
  });
  }
}


