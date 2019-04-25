import {Namespace} from '../utils/prefixes';

var parser = new Namespace();

export class VDI3682DATA {

public NoOfProcesses = `
PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?Process WHERE { 
	?Process a VDI3682:Process.

}
`
public NoOfTechnicalResources = `
PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?TR WHERE { 
	?TR a VDI3682:TechnicalResource.
}
`
public NoOfInOuts = `
PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?IoPoE WHERE { 
	?IoPoE a ?x.
    VALUES ?x {VDI3682:Energy VDI3682:Product VDI3682:Information}
}
`
public allProcessInfo = `
PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>

SELECT ?Process ?Input ?InputType ?Output ?OutputType ?TechnicalResource WHERE { 
	?Process a VDI3682:Process.
    OPTIONAL {?Process VDI3682:hasInput ?Input. ?Input rdf:type ?InputType. VALUES ?InputType {VDI3682:Product VDI3682:Energy VDI3682:Information}}
    OPTIONAL {?Process VDI3682:hasOutput ?Output. ?Output rdf:type ?OutputType. VALUES ?OutputType {VDI3682:Product VDI3682:Energy VDI3682:Information}}
    OPTIONAL {?TechnicalResource VDI3682:TechnicalResourceIsAssignedToProcessOperator ?Process.}
}
`
public allClasses = `
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT DISTINCT ?type
WHERE {
  ?type a owl:Class.
  FILTER(STRSTARTS(STR(?type), "http://www.hsu-ifa.de/ontologies/VDI3682#"))
}
`
public selectPredicateByDomain(owlClass){
    
    var selectString =`
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
    FILTER(STRSTARTS(STR(?Class), "http://www.hsu-ifa.de/ontologies/VDI3682#"))
}`
    return selectString
}

public selectClass(Individual){

var iri = parser.parseToIRI(Individual);

var selectString = `
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?Class WHERE {
    BIND(IRI("${iri}") AS ?Individual)
    ?Individual rdf:type ?Class.
    ?Class a owl:Class.
    FILTER(STRSTARTS(STR(?Class), "http://www.hsu-ifa.de/ontologies/VDI3682#"))
}
`
return selectString
}

public selectIndividualByClass(Class){
    var iri = parser.parseToIRI(Class);
    var selectString = `
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?Individual WHERE {
BIND(IRI("${iri}") AS ?Class)
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

    public createEntity(graph: tripel){
        

        var subject = "http://www.hsu-ifa.de/ontologies/VDI3682#" + parser.parseToName(graph.subject);
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