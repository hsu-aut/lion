import { Injectable } from '@nestjs/common';
import { map, Observable, pipe, tap } from 'rxjs';
import { SparqlService } from '../../shared-services/sparql.service';

/**
 * Service to handle generic T-Box requests (such as )
 */
@Injectable()
export class TBoxService { 

	constructor(
		private queryService: SparqlService,
	) {}

	/**
     * Get all object properties with a certain domain
     * @param domainClass IRI of the class in the domain
     * @returns All properties that have the given class in their domain
     */
	public getPropertiesByDomain(domainClass: string): Observable<string[]> {
		console.log(domainClass);
        
		const queryString = `
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            
            SELECT ?objectProperty WHERE {
            ?objectProperty rdfs:domain ?domain.
            # optionally if the range is a blank node no changes required
            OPTIONAL {    	
                ?domain owl:unionOf ?c.
                ?c rdf:rest* ?e.
                ?e rdf:first ?first.
            }
            # in case the range is a blank node, use the rdf:first as return
            BIND(IF(isBlank(?a),?first,?domain) AS ?Property)
            # filter for class
            FILTER(?domain = IRI("${domainClass}"))
            }
		`;

		return this.queryService.query(queryString).pipe(
			tap(res => console.log(res)),
			map(data => data.results.bindings.map(results => results["objectProperty"].value))
		);
	}


	/**
     * Returns all classes that are in the range of a given property
     * @param propertyIri IRI of the property to get range class of
     * @param namespace (Optional). Filter for a certain namespace
     * @returns List of IRIs of classes that are in the range of the given property
     */
	public getClassByRange(propertyIri: string, namespace =""): Observable<string[]> {
		const queryString = `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            
            SELECT ?class WHERE {
                ?ObjectProperty rdfs:range ?range.
            
                # optionally if the range is a blank node not changes required
                OPTIONAL {    	?range owl:unionOf ?c.
                    ?c rdf:rest* ?e.
                    ?e rdf:first ?g.
                }
                
                # in case the range is a blank node, use the rdf:first as return
                BIND(IF(isBlank(?a), ?g, ?range) AS ?class)
                
                # filter for class
                FILTER(?ObjectProperty = IRI("${propertyIri}"))
                FILTER(STRSTARTS(STR(?class), "${namespace}"))
            }`;
            
		return this.queryService.query(queryString).pipe(
			map(data => data.results.bindings.map(results => results["class"].value))
		);
	}


	public getClassesOfIndividual(individualIri: string, namespace = ""): Observable<string[]> {

		const queryString= `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        
        SELECT ?class WHERE {
            <${individualIri}> rdf:type ?class.
            ?class a owl:Class.
            FILTER(STRSTARTS(STR(?class), "${namespace}"))
        }`;

		return this.queryService.query(queryString).pipe(
			map(data => data.results.bindings.map(results => results["class"].value))
		);
	}
    
	public getIndividualsByClass(classIri: string, namespace = ""): Observable<string[]> {
		const queryString = `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        
        SELECT ?individual WHERE {
            BIND(IRI("${classIri}") AS ?class)
            ?individual a ?class.
            FILTER(STRSTARTS(STR(?class), "${namespace}"))
        }`;

		return this.queryService.query(queryString).pipe(
			map(data => data.results.bindings.map(results => results["individual"].value))
		);
	}
}

