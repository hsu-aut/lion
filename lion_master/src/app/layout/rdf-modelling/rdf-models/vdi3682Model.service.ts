import { Injectable } from '@angular/core';
import { PrefixesService } from './services/prefixes.service';
import { SparqlQueriesService } from './services/sparql-queries.service';
import { DataLoaderService } from '../../../shared/services/dataLoader.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Vdi3682ModelService {

  vdi3682data = new VDI3682DATA();
  vdi3682insert = new VDI3682INSERT();

  private LIST_OF_PROCESSES = [];
  private LIST_OF_TECHNICAL_RESOURCES = [];
  private LIST_OF_INPUTS_AND_OUTPUTS = [];
  private TABLE_OF_PROCESS_INFO = [];
  private LIST_OF_ALL_CLASSES = [];

  constructor(
    private query: SparqlQueriesService,
    private nameService: PrefixesService,
    private loadingScreenService: DataLoaderService
  ) {

    this.initializeVDI3682();
  }

  public initializeVDI3682(){
    this.loadLIST_OF_PROCESSES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_OF_PROCESSES = data;
    });
    this.loadLIST_OF_TECHNICAL_RESOURCES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_OF_TECHNICAL_RESOURCES = data;
    });
    this.loadLIST_OF_INPUTS_AND_OUTPUTS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_OF_INPUTS_AND_OUTPUTS = data;
    });
    this.loadALL_PROCESS_INFO_TABLE().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.TABLE_OF_PROCESS_INFO = data;
    });
    this.loadLIST_OF_ALL_CLASSES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_OF_ALL_CLASSES = data;
    });
  }

  public setLIST_OF_PROCESSES(list) {
    this.LIST_OF_PROCESSES = list;
  }
  public setLIST_OF_TECHNICAL_RESOURCES(list) {
    this.LIST_OF_TECHNICAL_RESOURCES = list;
  }
  public setLIST_OF_INPUTS_AND_OUTPUTS(list) {
    this.LIST_OF_INPUTS_AND_OUTPUTS = list;
  }
  public setALL_PROCESS_INFO_TABLE(list) {
    this.TABLE_OF_PROCESS_INFO = list;
  }
  public setLIST_OF_ALL_CLASSES(list) {
    this.LIST_OF_ALL_CLASSES = list;
  }


  public loadLIST_OF_PROCESSES() {
    this.loadingScreenService.startLoading();
    return this.query.selectList(this.vdi3682data.SELECT_LIST_OF_PROCESSES, 0);
  }
  public loadLIST_OF_TECHNICAL_RESOURCES() {
    this.loadingScreenService.startLoading();
    return this.query.selectList(this.vdi3682data.SELECT_LIST_OF_TECHNICAL_RESOURCES, 0);
  }
  public loadLIST_OF_INPUTS_AND_OUTPUTS() {
    this.loadingScreenService.startLoading();
    return this.query.selectList(this.vdi3682data.SELECT_LIST_OF_INPUTS_AND_OUTPUTS, 0);
  }
  public loadALL_PROCESS_INFO_TABLE() {
    this.loadingScreenService.startLoading();
    return this.query.selectTable(this.vdi3682data.SELECT_TABLE_OF_PROCESS_INFO);
  }
  public loadLIST_OF_ALL_CLASSES() {
    this.loadingScreenService.startLoading();
    return this.query.selectList(this.vdi3682data.SELECT_LIST_OF_ALL_CLASSES, 0);
  }
  public loadLIST_OF_PREDICATES_BY_DOMAIN(owlClass) {
    this.loadingScreenService.startLoading();
    owlClass = this.nameService.parseToIRI(owlClass);
    return this.query.selectList(this.vdi3682data.selectPredicateByDomain(owlClass), 0);
  }
  public loadLIST_OF_CLASSES_BY_RANGE(predicate) {
    this.loadingScreenService.startLoading();
    predicate = this.nameService.parseToIRI(predicate);
    return this.query.selectList(this.vdi3682data.selectClassByRange(predicate), 0);
  }
  public loadLIST_OF_CLASS_MEMBERSHIP(individual) {
    this.loadingScreenService.startLoading();
    individual = this.nameService.parseToIRI(individual);
    return this.query.selectList(this.vdi3682data.selectClass(individual), 0);
  }
  public loadLIST_OF_INDIVIDUALS_BY_CLASS(Class) {
    this.loadingScreenService.startLoading();
    Class = this.nameService.parseToIRI(Class);
    return this.query.selectList(this.vdi3682data.selectIndividualByClass(Class), 0);
  }

  public getLIST_OF_PROCESSES() {
    return this.LIST_OF_PROCESSES;
  }
  public getLIST_OF_TECHNICAL_RESOURCES() {
    return this.LIST_OF_TECHNICAL_RESOURCES;
  }
  public getLIST_OF_INPUTS_AND_OUTPUTS() {
    return this.LIST_OF_INPUTS_AND_OUTPUTS;
  }
  public getALL_PROCESS_INFO_TABLE() {
    return this.TABLE_OF_PROCESS_INFO;
  }
  public getLIST_OF_ALL_CLASSES() {
    return this.LIST_OF_ALL_CLASSES;
  }

  public insertTripel(graph: tripel) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

    var GRAPHS = this.nameService.getGraphs();
    var activeGraph = GRAPHS[this.nameService.getActiveGraph()];

    if(graph.subject.search("http://") != -1){
      graph.subject = graph.subject;
    } else if(graph.subject.search(":") != -1){
      graph.subject = this.nameService.parseToIRI(graph.subject);
    } else {
      graph.subject = activeNamespace + graph.subject;
    }
    graph.predicate = this.nameService.parseToIRI(graph.predicate);
    graph.object = this.nameService.parseToIRI(graph.object);
    return this.query.insert(this.vdi3682insert.createEntity(graph, activeGraph));
  }

  public buildTripel(graph: tripel) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;
    var GRAPHS = this.nameService.getGraphs();
    var activeGraph = GRAPHS[this.nameService.getActiveGraph()];

    if(graph.subject.search("http://") != -1){
      graph.subject = graph.subject;
    } else if(graph.subject.search(":") != -1){
      graph.subject = this.nameService.parseToIRI(graph.subject);
    } else {
      graph.subject = activeNamespace + graph.subject;
    }
    graph.predicate = this.nameService.parseToIRI(graph.predicate);
    graph.object = this.nameService.parseToIRI(graph.object);
    return this.vdi3682insert.createEntity(graph, activeGraph);
  }



}

export class VDI3682DATA {



  public SELECT_LIST_OF_PROCESSES = `
PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?Process WHERE { 
?Process a VDI3682:Process.

}
`

  public SELECT_LIST_OF_TECHNICAL_RESOURCES = `
PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?TR WHERE { 
?TR a VDI3682:TechnicalResource.
}
`

  public SELECT_LIST_OF_INPUTS_AND_OUTPUTS = `
PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?IoPoE WHERE { 
?IoPoE a ?x.
  VALUES ?x {VDI3682:Energy VDI3682:Product VDI3682:Information}
}
`

  public SELECT_TABLE_OF_PROCESS_INFO = `
PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>

SELECT ?Process ?Input ?InputType ?Output ?OutputType ?TechnicalResource WHERE { 
?Process a VDI3682:Process.
  OPTIONAL {?Process VDI3682:hasInput ?Input. ?Input rdf:type ?InputType. VALUES ?InputType {VDI3682:Product VDI3682:Energy VDI3682:Information}}
  OPTIONAL {?Process VDI3682:hasOutput ?Output. ?Output rdf:type ?OutputType. VALUES ?OutputType {VDI3682:Product VDI3682:Energy VDI3682:Information}}
  OPTIONAL {?TechnicalResource VDI3682:TechnicalResourceIsAssignedToProcessOperator ?Process.}
}
`

  public SELECT_LIST_OF_ALL_CLASSES = `
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT DISTINCT ?type
WHERE {
?type a owl:Class.
FILTER(STRSTARTS(STR(?type), "http://www.hsu-ifa.de/ontologies/VDI3682#"))
}
`

  public selectPredicateByDomain(owlClass) {

    var selectString = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?ObjectProperty WHERE { 
  ?ObjectProperty rdfs:domain ?a.
  # optionally if the range is a blank node not changes required
  OPTIONAL {    	?a owl:unionOf ?c.
          ?c rdf:rest* ?e.
          ?e rdf:first ?g.}
  # in case the range is a blank node, use the rdf:first as return    
  BIND(IF(isBlank(?a),?g,?a) AS ?Property)
  # filter for class
  FILTER(?Property = IRI("${owlClass}"))
}`
    return selectString
  }

  public selectClassByRange(predicate) {
    var selectString = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?Class WHERE { 
  ?ObjectProperty rdfs:range ?a.
  # optionally if the range is a blank node not changes required
  OPTIONAL {    	?a owl:unionOf ?c.
          ?c rdf:rest* ?e.
          ?e rdf:first ?g.}
  # in case the range is a blank node, use the rdf:first as return    
  BIND(IF(isBlank(?a),?g,?a) AS ?Class)
  # filter for class
  FILTER(?ObjectProperty = IRI("${predicate}"))
  FILTER(STRSTARTS(STR(?Class), "http://www.hsu-ifa.de/ontologies/VDI3682#"))
}`
    return selectString
  }


  public selectClass(Individual) {

    var selectString = `
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?Class WHERE {
  BIND(IRI("${Individual}") AS ?Individual)
  ?Individual rdf:type ?Class.
  ?Class a owl:Class.
  FILTER(STRSTARTS(STR(?Class), "http://www.hsu-ifa.de/ontologies/VDI3682#"))
}
`
    return selectString
  }

  public selectIndividualByClass(Class) {
    var selectString = `
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?Individual WHERE {
BIND(IRI("${Class}") AS ?Class)
?Individual a ?Class.
FILTER(STRSTARTS(STR(?Class), "http://www.hsu-ifa.de/ontologies/VDI3682#"))
}`
    return selectString
  }


}

export class tripel {
  subject: string;
  predicate: string;
  object: string;
}

export class VDI3682VARIABLES {
  simpleStatement: tripel

}

export class VDI3682INSERT {

  public createEntity(graph: tripel, activeGraph: string) {

    var insertString = `
      INSERT { 
        GRAPH <${activeGraph}>{
            ?subject ?predicate ?object;
            a owl:NamedIndividual.}
      } WHERE {
          BIND(IRI(STR("${graph.subject}")) AS ?subject).
          BIND(IRI(STR("${graph.predicate}")) AS ?predicate).
          BIND(IRI(STR("${graph.object}")) AS ?object).
      }`
      console.log(insertString)
    return insertString;
  }


}