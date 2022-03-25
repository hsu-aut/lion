import { Injectable } from '@nestjs/common';
import { map, Observable, pipe, tap } from 'rxjs';
import { SparqlResponse } from '../../interfaces/sparql/SparqlResponse';
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
	public getPropertiesByDomain(domainClass: string): Observable<SparqlResponse> {
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

		return this.queryService.query(queryString);
	}


	/**
     * Returns all classes that are in the range of a given property
     * @param propertyIri IRI of the property to get range class of
     * @param namespace (Optional). Filter for a certain namespace
     * @returns List of IRIs of classes that are in the range of the given property
     */
	public getRangeClasses(propertyIri: string, namespace =""): Observable<SparqlResponse> {
		const filterString = this.buildStringStartsFilter("class", namespace);
		console.log(propertyIri);
		const queryString = `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            
            SELECT ?class WHERE {
                ?property rdfs:range ?range.
            
                # optionally if the range is a blank node not changes required
                OPTIONAL {    	?range owl:unionOf ?c.
                    ?c rdf:rest* ?e.
                    ?e rdf:first ?g.
                }
                
                # in case the range is a blank node, use the rdf:first as return
                BIND(IF(isBlank(?range), ?g, ?range) AS ?class)
                
                # filter for given property
                FILTER(?property = IRI("${propertyIri}"))
                ${filterString}
            }`;
            
		return this.queryService.query(queryString).pipe(tap(res => console.log(res)));
	}


	/**
     * Get all classes of an individual within a given namespace
     * @param individualIri IRI of an individual to all get classes of
     * @param namespace Namespace to be used for filtering classes (optional). If none is given,  
     * @returns 
     */
	public getClassesOfIndividual(individualIri: string, namespace = null): Observable<SparqlResponse> {
		const filterString = this.buildStringStartsFilter("class", namespace);

		const queryString= `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        
        SELECT ?class WHERE {
            <${individualIri}> rdf:type ?class.
            ?class a owl:Class.
            ${filterString}
        }`;
        
		return this.queryService.query(queryString);
	}
    
	public getIndividualsByClass(classIri: string, namespace = ""): Observable<SparqlResponse> {
		const filterString = this.buildStringStartsFilter("individual", namespace);
		const queryString = `
        SELECT ?individual WHERE {
            BIND(IRI("${classIri}") AS ?class)
            ?individual a ?class.
            ${filterString}
        }`;

		return this.queryService.query(queryString);
	}
    
	/**
     * Creates a SPARQL STRSTARTS-filter for a given variable
     * @param varToFilter variable that will be filtered
     * @param filterValue value that will be used for filtering
     * @returns 
     */
	private buildStringStartsFilter(varToFilter: string, filterValue: string): string {
		let filterString = "";
		if (filterValue !== null) {
			filterString = `FILTER(STRSTARTS(STR(?${varToFilter}), "${filterValue}"))`;
		}
		return filterString;
	}
    
}
