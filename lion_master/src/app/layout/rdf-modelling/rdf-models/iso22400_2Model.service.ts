import { Injectable } from '@angular/core';
import { PrefixesService } from './services/prefixes.service';
import { SparqlQueriesService } from './services/sparql-queries.service';
import { DataLoaderService } from '../../../shared/services/dataLoader.service';
import { DownloadService } from '../rdf-models/services/download.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Iso22400_2ModelService {

  isoData = new ISO22400_2DATA();
  isoInsert = new ISO22400_2INSERT();

  private LIST_OF_ELEMENT_GROUPS = [];
  private LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES = [];
  private LIST_OF_KPIs = [];
  private LIST_OF_ORGANIZATIONAL_ELEMENTS = [];
  private LIST_OF_NON_ORGANIZATIONAL_ELEMENTS = [];
  private TABLE_ALL_ENTITY_INFO = [];

  constructor(
    private query: SparqlQueriesService,
    private downloadService: DownloadService,
    private nameService: PrefixesService,
    private loadingScreenService: DataLoaderService
  ) {

    this.initializeISO22400_2();

  }

  initializeISO22400_2() {
    this.loadLIST_OF_ELEMENT_GROUPS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_OF_ELEMENT_GROUPS = data;
    });
    this.loadLIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES = data;
    });
    this.loadLIST_OF_KPIs().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_OF_KPIs = data;
    });
    this.loadLIST_OF_ORGANIZATIONAL_ELEMENTS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_OF_ORGANIZATIONAL_ELEMENTS = data;
    });
    this.loadLIST_OF_NON_ORGANIZATIONAL_ELEMENTS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_OF_NON_ORGANIZATIONAL_ELEMENTS = data;
    });
    this.loadTABLE_ALL_ENTITY_INFO().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.TABLE_ALL_ENTITY_INFO = data;
    });
  }

  // loaders
  public loadTABLE_ALL_ENTITY_INFO() {
    this.loadingScreenService.startLoading();
    return this.query.selectTable(this.isoData.SELECT_TABLE_ALL_ENTITY_INFO);
  }
  public loadLIST_OF_KPIs() {
    this.loadingScreenService.startLoading();
    return this.query.selectList(this.isoData.SELECT_LIST_OF_KPIs, 0);
  }
  public loadLIST_OF_ORGANIZATIONAL_ELEMENTS() {
    this.loadingScreenService.startLoading();
    return this.query.selectList(this.isoData.SELECT_LIST_OF_ORGANIZATIONAL_ELEMENTS, 0);
  }
  public loadLIST_OF_NON_ORGANIZATIONAL_ELEMENTS() {
    this.loadingScreenService.startLoading();
    return this.query.selectList(this.isoData.SELECT_LIST_OF_NON_ORGANIZATIONAL_ELEMENTS, 0);
  }
  public loadLIST_OF_ELEMENT_GROUPS() {
    this.loadingScreenService.startLoading();
    return this.query.selectList(this.isoData.SELECT_LIST_OF_ELEMENT_GROUPS, 0);
  }
  public loadLIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES() {
    this.loadingScreenService.startLoading();
    return this.query.selectList(this.isoData.SELECT_LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES, 0);
  }

  public loadLIST_OF_ELEMENTS_BY_GROUP(groupNameIRI: string) {
    this.loadingScreenService.startLoading();
    groupNameIRI = this.nameService.parseToIRI(groupNameIRI);
    return this.query.selectList(this.isoData.SELECT_LIST_OF_ELEMENTS_BY_GROUP(groupNameIRI), 0);
  }

  // getters
  public getTABLE_ALL_ENTITY_INFO() {
    return this.TABLE_ALL_ENTITY_INFO;
  }
  public getLIST_OF_KPIs() {
    return this.LIST_OF_KPIs;
  }
  public getLIST_OF_ORGANIZATIONAL_ELEMENTS() {
    return this.LIST_OF_ORGANIZATIONAL_ELEMENTS;
  }
  public getLIST_OF_NON_ORGANIZATIONAL_ELEMENTS() {
    return this.LIST_OF_NON_ORGANIZATIONAL_ELEMENTS;
  }
  public getLIST_OF_ELEMENT_GROUPS() {
    return this.LIST_OF_ELEMENT_GROUPS;
  }
  public getLIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES() {
    return this.LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES;
  }

  // setters
  public setTABLE_ALL_ENTITY_INFO(table) {
    this.TABLE_ALL_ENTITY_INFO = table;
  }
  public setLIST_OF_KPIs(list) {
    this.LIST_OF_KPIs = list;
  }
  public setLIST_OF_ORGANIZATIONAL_ELEMENTS(list) {
    this.LIST_OF_ORGANIZATIONAL_ELEMENTS = list;
  }
  public setLIST_OF_NON_ORGANIZATIONAL_ELEMENTS(list) {
    this.LIST_OF_NON_ORGANIZATIONAL_ELEMENTS = list;
  }

  // builders
  public createTripel(variables: elementVariables, execute: boolean) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

    var GRAPHS = this.nameService.getGraphs();
    var activeGraph = GRAPHS[this.nameService.getActiveGraph()];


    if (variables.elementIRI.search("http://") != -1) {
      variables.elementIRI = variables.elementIRI;
    } else if (variables.elementIRI.search(":") != -1) {
      variables.elementIRI = this.nameService.parseToIRI(variables.elementIRI);
    } else {
      variables.elementIRI = activeNamespace + variables.elementIRI;
    }
    if (variables.entityIRI.search("http://") != -1) {
      variables.entityIRI = variables.entityIRI;
    } else if (variables.entityIRI.search(":") != -1) {
      variables.entityIRI = this.nameService.parseToIRI(variables.entityIRI);
    } else {
      variables.entityIRI = activeNamespace + variables.entityIRI;
    }
    variables.elementClass = this.nameService.parseToIRI(variables.elementClass);
    variables.entityClass = this.nameService.parseToIRI(variables.entityClass);
    if (execute) {
      return this.query.insert(this.isoInsert.createElement(variables, activeGraph));
    } else {
      var blobObserver = new Observable((observer) => {
        let insertString = this.isoInsert.createElement(variables, activeGraph);
        const blob = new Blob([insertString], { type: 'text/plain' });
        const name = 'insert.txt';
        this.downloadService.download(blob, name);
        observer.next();
        observer.complete();
      });
      return blobObserver;
    }

  }
}

export class ISO22400_2DATA {

  public SELECT_LIST_OF_KPIs = `
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>

  SELECT ?Element
  WHERE { 
       ?Element a ISO:KeyPerformanceIndicator.
  }
  `

  public SELECT_LIST_OF_ORGANIZATIONAL_ELEMENTS = `
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  
  SELECT ?Element
  WHERE { 
       ?Element a ISO:OrganizationalTerms.
  }
  `

  public SELECT_LIST_OF_NON_ORGANIZATIONAL_ELEMENTS = `
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>

  SELECT ?Element
  WHERE { 
   	?Element a ISO:Elements.
    MINUS {?Element a ISO:OrganizationalTerms.}
  }
  `

  public SELECT_LIST_OF_ELEMENT_GROUPS = `
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>

  SELECT ?ISO_Elements
  WHERE { 
   ?ISO_Elements sesame:directSubClassOf ISO:Elements.
  }`

  public SELECT_LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES = `
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  
  SELECT ?ISO_Elements
  WHERE { 
      BIND(IRI("http://www.hsu-ifa.de/ontologies/ISO22400-2#OrganizationalTerms") AS ?Group)
       ?ISO_Elements rdfs:subClassOf ?Group.
      FILTER (?ISO_Elements != owl:Nothing)
      FILTER (?ISO_Elements != ?Group)
      FILTER (?ISO_Elements != ISO:OperationCluster)
  }`

  public SELECT_TABLE_ALL_ENTITY_INFO = `
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

  SELECT ?Entity ?EntityType
  WHERE { 
   	?Entity a ISO:OrganizationalTerms.
    ?Entity rdf:type ?EntityType.
    ?EntityType sesame:directSubClassOf ISO:OrganizationalTerms.
  }
  `

  public SELECT_LIST_OF_ELEMENTS_BY_GROUP(groupNameIRI: string) {

    let selectString = `
   PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
   PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
   PREFIX owl: <http://www.w3.org/2002/07/owl#>
   
   SELECT ?ISO_Elements
   WHERE { 
       BIND(IRI("${groupNameIRI}") AS ?Group)
        ?ISO_Elements rdfs:subClassOf ?Group.
       FILTER (?ISO_Elements != owl:Nothing)
       FILTER (?ISO_Elements != ?Group)
       FILTER (?ISO_Elements != ISO:OperationCluster)
   }`
    return selectString
  }

}

export class ISO22400_2VARIABLES {
  simpleElement: elementVariables
}



export class ISO22400_2INSERT {

  public createElement(simpleElementVariables: elementVariables, activeGraph: string) {

    let value = simpleElementVariables.simpleValue;
    let duration = simpleElementVariables.duration;
    let UnitOfMeasure = simpleElementVariables.UnitOfMeasure;
    let relevantPeriod = simpleElementVariables.relevantPeriod;
    let entityIRI = simpleElementVariables.entityIRI;
    let entityClass = simpleElementVariables.entityClass;
    let elementIRI = simpleElementVariables.elementIRI;
    let elementClass = simpleElementVariables.elementClass;

    var optionals = {
      nonTimeElement: `?newElement  ISO:Value "${value}"^^xsd:string;
                                    ISO:UnitOfMeasure "${UnitOfMeasure}"^^xsd:string.`,
      timeElement: `?newElement ISO:timeSpan "${duration}"^^xsd:duration.`,


    }

    // add a check for empties and if one is found delete the string
    for (const i in optionals) {

      const element = optionals[i];
      if (element.search(`undefined`) != -1) { optionals[i] = "" }
    }

    var insertString = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    
    INSERT {
        
    GRAPH <${activeGraph}>{
    
    ?entity ISO:hasElement ?newElement;
            rdf:type ?IsoUnit;
            a owl:NamedIndividual.
    ?newElement rdf:type ?elementClass;
            a owl:NamedIndividual;
            ISO:forPeriod "${relevantPeriod}"^^xsd:dateTimeStamp.
            
    
    #        optional, depending on whether it is a time element or not
    ${optionals.nonTimeElement}      
    ${optionals.timeElement}  

        }
    } WHERE {
        BIND(IRI(STR("${entityIRI}")) AS ?entity).      
        BIND(IRI(STR("${entityClass}")) AS ?IsoUnit).   
        BIND(IRI(STR("${elementIRI}")) AS ?newElement).
        BIND(IRI(STR("${elementClass}")) AS ?elementClass).
    }
    `
    console.log(insertString)
    return insertString;
  }

}

class elementVariables {
  entityIRI: string;
  entityClass: string;
  elementIRI: string;
  elementClass: string;
  relevantPeriod: string;
  UnitOfMeasure: string;
  simpleValue: string;
  duration: string;
}