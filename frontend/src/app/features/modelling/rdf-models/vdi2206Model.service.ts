import { Injectable } from '@angular/core';
import { PrefixesService } from '@shared-services/prefixes.service';
import { QueriesService } from '@shared-services/backEnd/queries.service';
import { GraphOperationsService } from '@shared-services/backEnd/graphOperations.service';
import { DataLoaderService } from '@shared-services/dataLoader.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
        private query: QueriesService,
        private prefixService: PrefixesService,
        private loadingScreenService: DataLoaderService,
    ) {

        this.initializeVDI2206();

    }

    public initializeVDI2206() {
        this.loadLIST_OF_SYSTEMS().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.LIST_OF_SYSTEMS = data;
        });
        this.loadLIST_OF_MODULES().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.LIST_OF_MODULES = data;
        });
        this.loadLIST_OF_COMPONENTS().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.LIST_OF_COMPONENTS = data;
        });
        this.loadLIST_OF_CLASSES().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.LIST_OF_CLASSES = data;
        });
        this.loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS = data;
        });
        this.loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD = data;
        });
        this.loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM = data;
        });
        this.loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS = data;
        });
        this.loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD = data;
        });
        this.loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM = data;
        });
    }

    public loadTABLE_OF_SYSTEMS_AND_MODULES(): Observable<[]> {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.vdi2206Data.SPARQL_SELECT_SYSTEMS_AND_MODULES) as Observable<[]>;
    }

    public loadLIST_OF_SYSTEMS(): Observable<Array<string>> {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_LIST(this.vdi2206Data.SPARQL_SELECT_ALL_SYSTEMS, 0) as Observable<Array<string>>;
    }
    public loadLIST_OF_MODULES(): Observable<Array<string>> {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_LIST(this.vdi2206Data.SPARQL_SELECT_ALL_MODULES, 0) as Observable<Array<string>>;
    }
    public loadLIST_OF_COMPONENTS() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_LIST(this.vdi2206Data.SPARQL_SELECT_ALL_COMPONENTS, 0);
    }
    public loadLIST_OF_CLASSES() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_LIST(this.vdi2206Data.SPARQL_SELECT_ALL_CLASSES, 0);
    }
    public loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.vdi2206Data.SPARQL_SELECT_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS);
    }
    public loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.vdi2206Data.SPARQL_SELECT_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD);
    }
    public loadTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.vdi2206Data.SPARQL_SELECT_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM);
    }
    public loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.vdi2206Data.SPARQL_SELECT_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS);
    }
    public loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.vdi2206Data.SPARQL_SELECT_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD);
    }
    public loadTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.vdi2206Data.SPARQL_SELECT_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM);
    }

    public loadLIST_OF_PREDICATES_BY_DOMAIN(owlClass) {
        owlClass = this.prefixService.parseToIRI(owlClass);
        return this.query.SPARQL_SELECT_LIST(this.vdi2206Data.selectPredicateByDomain(owlClass), 0);
    }
    public loadLIST_OF_CLASSES_BY_RANGE(predicate) {
        predicate = this.prefixService.parseToIRI(predicate);
        return this.query.SPARQL_SELECT_LIST(this.vdi2206Data.selectClassByRange(predicate), 0);
    }
    public loadLIST_OF_CLASS_MEMBERSHIP(individual) {
        individual = this.prefixService.parseToIRI(individual);
        return this.query.SPARQL_SELECT_LIST(this.vdi2206Data.selectClass(individual), 0);
    }
    public loadLIST_OF_INDIVIDUALS_BY_CLASS(Class) {
        Class = this.prefixService.parseToIRI(Class);
        return this.query.SPARQL_SELECT_LIST(this.vdi2206Data.selectIndividualByClass(Class), 0);
    }

    public setLIST_OF_SYSTEMS(list) {
        this.LIST_OF_SYSTEMS = list;
    }
    public setLIST_OF_MODULES(list) {
        this.LIST_OF_MODULES = list;
    }
    public setLIST_OF_COMPONENTS(list) {
        this.LIST_OF_COMPONENTS = list;
    }
    public setLIST_OF_CLASSES(list) {
        this.LIST_OF_CLASSES = list;
    }

    public setTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS(table) {
        this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS = table;
    }
    public setTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD(table) {
        this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD = table;
    }
    public setTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM(table) {
        this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM = table;
    }
    public setTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS(table) {
        this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS = table;
    }
    public setTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD(table) {
        this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD = table;
    }
    public setTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM(table) {
        this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM = table;
    }

    public getLIST_OF_SYSTEMS() {
        return this.LIST_OF_SYSTEMS;
    }
    public getLIST_OF_MODULES() {
        return this.LIST_OF_MODULES;
    }
    public getLIST_OF_COMPONENTS() {
        return this.LIST_OF_COMPONENTS;
    }
    public getLIST_OF_CLASSES() {
        return this.LIST_OF_CLASSES;
    }
    public getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS() {
        return this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS;
    }
    public getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD() {
        return this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD;
    }
    public getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM() {
        return this.TABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM;
    }
    public getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS() {
        return this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS;
    }
    public getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD() {
        return this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD;
    }
    public getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM() {
        return this.TABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM;
    }

    public insertTripel(triple: tripel) {
        const PREFIXES = this.prefixService.getPrefixes();
        const activeNamespace = this.prefixService.getActiveNamespace().namespace;

        if (triple.subject.search("http://") != -1) {
            triple.subject = triple.subject;
        } else if (triple.subject.search(":") != -1) {
            triple.subject = this.prefixService.parseToIRI(triple.subject);
        } else {
            triple.subject = activeNamespace + this.prefixService.parseToIRI(triple.subject);
        }
        triple.predicate = this.prefixService.parseToIRI(triple.predicate);
        triple.object = this.prefixService.parseToIRI(triple.object);

        return this.query.executeUpdate(this.vdi2206Insert.createEntity(triple));
    }

    public buildTripel(triple: tripel) {
        const PREFIXES = this.prefixService.getPrefixes();
        const activeNamespace = this.prefixService.getActiveNamespace().namespace;

        if (triple.subject.search("http://") != -1) {
            triple.subject = triple.subject;
        } else if (triple.subject.search(":") != -1) {
            triple.subject = this.prefixService.parseToIRI(triple.subject);
        } else {
            triple.subject = activeNamespace + this.prefixService.parseToIRI(triple.subject);
        }
        triple.predicate = this.prefixService.parseToIRI(triple.predicate);
        triple.object = this.prefixService.parseToIRI(triple.object);

        return this.vdi2206Insert.createEntity(triple);
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

    public SPARQL_SELECT_SYSTEMS_AND_MODULES = `
    PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?systemOrModule ?systemOrModuleLabel WHERE {
        {
            ?systemOrModule a VDI2206:System.
        }
        UNION
        {
            ?systemOrModule a VDI2206:Module.
        }
        OPTIONAL {
            ?systemOrModule rdfs:label ?systemOrModuleLabel.
        }
    }`;

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

SELECT ?System ?systemLabel ?consistsOfEntity ?EntityType WHERE {
    ?System a VDI2206:System;
    rdfs:label ?systemLabel.
    OPTIONAL {
        ?System VDI2206:consistsOf ?consistsOfEntity.
        ?consistsOfEntity rdf:type ?EntityType.
        VALUES ?EntityType {VDI2206:System VDI2206:Module VDI2206:Component}
    }
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

        const selectString = `
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  SELECT ?Class WHERE {
      BIND(IRI("${Individual}") AS ?Individual)
      ?Individual rdf:type ?Class.
      ?Class a owl:Class.
      FILTER(STRSTARTS(STR(?Class), "http://www.hsu-ifa.de/ontologies/VDI2206#"))
  }
  `;
        return selectString;
    }
    public selectPredicateByDomain(owlClass) {
        const selectString = `
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
  }`;
        return selectString;
    }

    public selectClassByRange(predicate) {
        const selectString = `
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
  }`;
        return selectString;
    }
    public selectIndividualByClass(Class) {
        const selectString = `
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  SELECT ?Individual WHERE {
  BIND(IRI("${Class}") AS ?Class)
  ?Individual a ?Class.
  FILTER(STRSTARTS(STR(?Class), "http://www.hsu-ifa.de/ontologies/VDI2206#"))
  }`;
        return selectString;
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

        const insertString = `
      INSERT {
          ?subject ?predicate ?object;
          a owl:NamedIndividual.
      } WHERE {
          BIND(IRI(STR("${graph.subject}")) AS ?subject).
          BIND(IRI(STR("${graph.predicate}")) AS ?predicate).
          BIND(IRI(STR("${graph.object}")) AS ?object).
      }`;
        console.log(insertString);
        return insertString;
    }


}
