import { Namespace } from '../utils/prefixes';
import { PrefixesService } from './services/prefixes.service';

var parser = new Namespace;
var nameService = new PrefixesService;

export class VDI2206DATA {

    public NoOfSystems = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?System WHERE { 
	?System a VDI2206:System.
}
`
public NoOfModules = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?Module WHERE { 
	?Module a VDI2206:Module.
}
`
public NoOfComponents = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?Component WHERE { 
	?Component a VDI2206:Component.
}
`
    public allClasses = `
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT DISTINCT ?type
WHERE {
  ?type a owl:Class.
  FILTER(STRSTARTS(STR(?type), "http://www.hsu-ifa.de/ontologies/VDI2206#"))
}
`
    public allStructureInfoContainmentbySys = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?System ?consistsOfEntity ?EntityType WHERE { 
	?System a VDI2206:System.
    OPTIONAL {?System VDI2206:consistsOf ?consistsOfEntity. ?consistsOfEntity rdf:type ?EntityType. VALUES ?EntityType {VDI2206:System VDI2206:Module VDI2206:Component}}
}
`
public allStructureInfoContainmentbyMod = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?Module ?consistsOfEntity ?EntityType WHERE { 
	?Module a VDI2206:Module.
    OPTIONAL {?Module VDI2206:consistsOf ?consistsOfEntity. ?consistsOfEntity rdf:type ?EntityType. VALUES ?EntityType {VDI2206:Module VDI2206:Component}}
}
`
public allStructureInfoInheritancebySys = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?System ?childEntity ?childEntityType WHERE { 
	?System a VDI2206:System.
    OPTIONAL {?System VDI2206:hasChild ?childEntity. ?childEntity rdf:type ?childEntityType. VALUES ?childEntityType {VDI2206:System VDI2206:Module VDI2206:Component}}
}
`
public allStructureInfoInheritancebyMod = `
PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?Module ?childEntity ?childEntityType WHERE { 
	?Module a VDI2206:Module.
    OPTIONAL {?Module VDI2206:consistsOf ?childEntity. ?childEntity rdf:type ?childEntityType. VALUES ?childEntityType {VDI2206:Module VDI2206:Component}}
}
`


    public selectClass(Individual) {

        var iri = parser.parseToIRI(Individual);

        var selectString = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    SELECT ?Class WHERE {
        BIND(IRI("${iri}") AS ?Individual)
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
        var iri = parser.parseToIRI(predicate);
        var selectString =`
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
        FILTER(?ObjectProperty = IRI("${iri}"))
        FILTER(STRSTARTS(STR(?Class), "http://www.hsu-ifa.de/ontologies/VDI2206#"))
    }`
        return selectString
    }
    public selectIndividualByClass(Class){
        console.log(Class);
        var iri = parser.parseToIRI(Class);
        console.log(iri);
        var selectString = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    SELECT ?Individual WHERE {
    BIND(IRI("${iri}") AS ?Class)
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
        var activeNamespace = parser.PREFIXES[nameService.getActiveNamespace()].namespace;
        var subject = activeNamespace + parser.parseToName(graph.subject);
        var predicate = parser.parseToIRI(graph.predicate);
        var object = parser.parseToIRI(graph.object);

        var insertString = `
        INSERT { 
            ?subject ?predicate ?object;
            a owl:NamedIndividual.
        } WHERE {
            BIND(IRI(STR("${subject}")) AS ?subject).
            BIND(IRI(STR("${predicate}")) AS ?predicate).
            BIND(IRI(STR("${object}")) AS ?object).
        }`
        console.log(insertString);
        return insertString;
    }


}
