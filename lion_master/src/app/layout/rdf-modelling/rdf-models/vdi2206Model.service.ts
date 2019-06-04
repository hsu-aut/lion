import { Injectable } from '@angular/core';
import { PrefixesService } from './services/prefixes.service';
import { SparqlQueriesService } from './services/sparql-queries.service';
import { DataLoaderService } from '../../../shared/services/dataLoader.service';


@Injectable({
  providedIn: 'root'
})
export class Vdi2206ModelService {

  vdi2206Data = new VDI2206DATA();
  vdi2206Insert = new VDI2206INSERT();

  private LIST_OF_SYSTEMS = [];
  private LIST_OF_MODULES = [];
  private LIST_OF_COMPONENTS = [];
  private LIST_OF_CLASSES = [];
  private TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS = [];
  private TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD = [];
  private TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM = [];
  private TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS = [];
  private TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD = [];
  private TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM = [];

constructor(
  private query: SparqlQueriesService,
  private nameService: PrefixesService,
  private loadingScreenService: DataLoaderService
) { 

  this.initializeVDI2206();

}

public initializeVDI2206(){
  this.loadLIST_OF_SYSTEMS().subscribe((data: any) => {
    this.loadingScreenService.stopLoading();
    this.LIST_OF_SYSTEMS = data;
  });
  this.loadLIST_OF_MODULES().subscribe((data: any) => {
    this.loadingScreenService.stopLoading();
    this.LIST_OF_MODULES = data;
  });
  this.loadLIST_OF_COMPONENTS().subscribe((data: any) => {
    this.loadingScreenService.stopLoading();
    this.LIST_OF_COMPONENTS = data;
  });
  this.loadLIST_OF_CLASSES().subscribe((data: any) => {
    this.loadingScreenService.stopLoading();
    this.LIST_OF_CLASSES = data;
  });
  this.loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS().subscribe((data: any) => {
    this.loadingScreenService.stopLoading();
    this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS = data;
  });
  this.loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD().subscribe((data: any) => {
    this.loadingScreenService.stopLoading();
    this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD = data;
  });
  this.loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM().subscribe((data: any) => {
    this.loadingScreenService.stopLoading();
    this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM = data;
  });
  this.loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS().subscribe((data: any) => {
    this.loadingScreenService.stopLoading();
    this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS = data;
  });
  this.loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD().subscribe((data: any) => {
    this.loadingScreenService.stopLoading();
    this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD = data;
  });
  this.loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM().subscribe((data: any) => {
    this.loadingScreenService.stopLoading();
    this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM = data;
  });
}

public loadLIST_OF_SYSTEMS(){
  this.loadingScreenService.startLoading();
  return this.query.selectList(this.vdi2206Data.SPARQL_SELECT_ALL_SYSTEMS, 0);
}
public loadLIST_OF_MODULES(){
  this.loadingScreenService.startLoading();
  return this.query.selectList(this.vdi2206Data.SPARQL_SELECT_ALL_MODULES, 0);
}
public loadLIST_OF_COMPONENTS(){
  this.loadingScreenService.startLoading();
  return this.query.selectList(this.vdi2206Data.SPARQL_SELECT_ALL_COMPONENTS, 0);
}
public loadLIST_OF_CLASSES(){
  this.loadingScreenService.startLoading();
  return this.query.selectList(this.vdi2206Data.SPARQL_SELECT_ALL_CLASSES, 0);
}
public loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS(){
  this.loadingScreenService.startLoading();
  return this.query.selectTable(this.vdi2206Data.SPARQL_SELECT_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS);
}
public loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD(){
  this.loadingScreenService.startLoading();
  return this.query.selectTable(this.vdi2206Data.SPARQL_SELECT_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD);
}
public loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM(){
  this.loadingScreenService.startLoading();
  return this.query.selectTable(this.vdi2206Data.SPARQL_SELECT_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM);
}
public loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS(){
  this.loadingScreenService.startLoading();
  return this.query.selectTable(this.vdi2206Data.SPARQL_SELECT_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS);
}
public loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD(){
  this.loadingScreenService.startLoading();
  return this.query.selectTable(this.vdi2206Data.SPARQL_SELECT_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD);
}
public loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM(){
  this.loadingScreenService.startLoading();
  return this.query.selectTable(this.vdi2206Data.SPARQL_SELECT_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM);
}

public loadLIST_OF_PREDICATES_BY_DOMAIN(owlClass){ 
  owlClass = this.nameService.parseToIRI(owlClass);
  return this.query.selectList(this.vdi2206Data.selectPredicateByDomain(owlClass), 0);
}
public loadLIST_OF_CLASSES_BY_RANGE(predicate){ 
  predicate = this.nameService.parseToIRI(predicate);
  return this.query.selectList(this.vdi2206Data.selectClassByRange(predicate), 0);
}
public loadLIST_OF_CLASS_MEMBERSHIP(individual){ 
  individual = this.nameService.parseToIRI(individual);
  return this.query.selectList(this.vdi2206Data.selectClass(individual), 0);
}
public loadLIST_OF_INDIVIDUALS_BY_CLASS(Class){ 
  Class = this.nameService.parseToIRI(Class);
  return this.query.selectList(this.vdi2206Data.selectIndividualByClass(Class), 0);
}

public setLIST_OF_SYSTEMS(list){
  this.LIST_OF_SYSTEMS = list;
}
public setLIST_OF_MODULES(list){
  this.LIST_OF_MODULES = list;
}
public setLIST_OF_COMPONENTS(list){
  this.LIST_OF_COMPONENTS = list;
}
public setLIST_OF_CLASSES(list){
  this.LIST_OF_CLASSES = list;
}

public setTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS(table){
  this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS = table;
}
public setTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD(table){
  this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD = table;
}
public setTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM(table){
  this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM = table;
}
public setTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS(table){
  this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS = table;
}
public setTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD(table){
  this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD = table;
}
public setTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM(table){
  this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM = table;
}

public getLIST_OF_SYSTEMS(){
  return this.LIST_OF_SYSTEMS;
}
public getLIST_OF_MODULES(){
  return this.LIST_OF_MODULES
}
public getLIST_OF_COMPONENTS(){
  return this.LIST_OF_COMPONENTS
}
public getLIST_OF_CLASSES(){
  return this.LIST_OF_CLASSES
}
public getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS(){
  return this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS
}
public getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD(){
  return this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD
}
public getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM(){
  return this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM
}
public getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS(){
  return this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS
}
public getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD(){
  return this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD
}
public getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM(){
  return this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM
}

public insertTripel(graph: tripel) {
  var PREFIXES = this.nameService.getPrefixes();
  var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

  if(graph.subject.search("http://") != -1){
    graph.subject = graph.subject;
  } else if(graph.subject.search(":") != -1){
    graph.subject = this.nameService.parseToIRI(graph.subject);
  } else {
    graph.subject = activeNamespace + this.nameService.parseToIRI(graph.subject);
  }
  graph.predicate = this.nameService.parseToIRI(graph.predicate);
  graph.object = this.nameService.parseToIRI(graph.object);

  return this.query.insert(this.vdi2206Insert.createEntity(graph));
}

public buildTripel(graph: tripel) {
  var PREFIXES = this.nameService.getPrefixes();
  var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

  if(graph.subject.search("http://") != -1){
    graph.subject = graph.subject;
  } else if(graph.subject.search(":") != -1){
    graph.subject = this.nameService.parseToIRI(graph.subject);
  } else {
    graph.subject = activeNamespace + this.nameService.parseToIRI(graph.subject);
  }
  graph.predicate = this.nameService.parseToIRI(graph.predicate);
  graph.object = this.nameService.parseToIRI(graph.object);

  return this.vdi2206Insert.createEntity(graph);
}

}

export class VDI2206DATA {


  public SPARQL_SELECT_ALL_SYSTEMS = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?System WHERE { 
?System a VDI2206:System.
}
`;

public SPARQL_SELECT_ALL_MODULES = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?Module WHERE { 
?Module a VDI2206:Module.
}
`;

public SPARQL_SELECT_ALL_COMPONENTS = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?Component WHERE { 
?Component a VDI2206:Component.
}
`;

  public SPARQL_SELECT_ALL_CLASSES = `
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT DISTINCT ?type
WHERE {
?type a owl:Class.
FILTER(STRSTARTS(STR(?type), "http://www.hsu-ifa.de/ontologies/VDI2206#"))
}
`;

  public SPARQL_SELECT_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?System ?consistsOfEntity ?EntityType WHERE { 
?System a VDI2206:System.
  OPTIONAL {?System VDI2206:consistsOf ?consistsOfEntity. ?consistsOfEntity rdf:type ?EntityType. VALUES ?EntityType {VDI2206:System VDI2206:Module VDI2206:Component}}
}
`;



public SPARQL_SELECT_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?Module ?consistsOfEntity ?EntityType WHERE { 
?Module a VDI2206:Module.
  OPTIONAL {?Module VDI2206:consistsOf ?consistsOfEntity. ?consistsOfEntity rdf:type ?EntityType. VALUES ?EntityType {VDI2206:Module VDI2206:Component}}
}
`;

public SPARQL_SELECT_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?Component WHERE { 
?Component a VDI2206:Component.
}
`;


public SPARQL_SELECT_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?System ?childEntity ?childEntityType WHERE { 
?System a VDI2206:System.
  OPTIONAL {?System VDI2206:hasChild ?childEntity. ?childEntity rdf:type ?childEntityType. VALUES ?childEntityType {VDI2206:System VDI2206:Module VDI2206:Component}}
}
`
public SPARQL_SELECT_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?Module ?childEntity ?childEntityType WHERE { 
?Module a VDI2206:Module.
  OPTIONAL {?Module VDI2206:hasChild ?childEntity. ?childEntity rdf:type ?childEntityType. VALUES ?childEntityType {VDI2206:Module VDI2206:Component}}
}
`
public SPARQL_SELECT_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?Component ?childEntity ?childEntityType WHERE { 
?Component a VDI2206:Component.
  OPTIONAL {?Component VDI2206:hasChild ?childEntity. ?childEntity rdf:type ?childEntityType. VALUES ?childEntityType {VDI2206:Component}}
}
`


  public selectClass(Individual) {

      var selectString = `
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  SELECT ?Class WHERE {
      BIND(IRI("${Individual}") AS ?Individual)
      ?Individual rdf:type ?Class.
      ?Class a owl:Class.
      FILTER(STRSTARTS(STR(?Class), "http://www.hsu-ifa.de/ontologies/VDI2206#"))
  }
  `
      return selectString
  }
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

  public selectClassByRange(predicate){
      var selectString =`
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  SELECT DISTINCT ?Class WHERE { 
      ?ObjectProperty rdfs:range ?a.
      # optionally if the range is a blank node not changes required
      OPTIONAL {    	?a owl:unionOf ?c.
                      ?c rdf:rest* ?e.
                      ?e rdf:first ?g.}
      # in case the range is a blank node, use the rdf:first as return    
      BIND(IF(isBlank(?a),?g,?a) AS ?Class)
      # filter for class
      FILTER(?ObjectProperty = IRI("${predicate}"))
      FILTER(STRSTARTS(STR(?Class), "http://www.hsu-ifa.de/ontologies/VDI2206#"))
  }`
      return selectString
  }
  public selectIndividualByClass(Class){
      var selectString = `
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  SELECT ?Individual WHERE {
  BIND(IRI("${Class}") AS ?Class)
  ?Individual a ?Class.
  FILTER(STRSTARTS(STR(?Class), "http://www.hsu-ifa.de/ontologies/VDI2206#"))
  }`
  return selectString
  }
}


export class tripel {
  subject: string;
  predicate: string;
  object: string;
}

export class VDI2206VARIABLES {
  simpleStatement: tripel
}

export class VDI2206INSERT {

  public createEntity(graph: tripel) {

      var insertString = `
      INSERT { 
          ?subject ?predicate ?object;
          a owl:NamedIndividual.
      } WHERE {
          BIND(IRI(STR("${graph.subject}")) AS ?subject).
          BIND(IRI(STR("${graph.predicate}")) AS ?predicate).
          BIND(IRI(STR("${graph.object}")) AS ?object).
      }`
      console.log(insertString);
      return insertString;
  }


}
