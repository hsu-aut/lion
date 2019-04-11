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

  // semanz40 model data
  modelData = new VDI3682DATA();
  modelInsert = new VDI3682INSERT();
  modelVariables = new VDI3682VARIABLES();
  
  // graph db data
  allFunctionInfo: any;
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

  constructor(private query:SparqlQueriesService, private dlService: DownloadService) { }

  ngOnInit() {
      this.query.select(this.modelData.allFunctionInfo).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.allFunctionInfo = this.TableUtil.buildTable(data);
      console.log(this.allFunctionInfo)
      // parse prefixes where possible 
      
      });
    this.query.select(this.modelData.allClasses).subscribe((data: any) => {
        // log + assign data and stop loader
        console.log(data);
        this.allClasses = data;
        // parse prefixes where possible 
        this.namespaceParser.parseToPrefix(data);
        });
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
    const name = 'vdi3682Insert.txt';
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
    });
  }
}
