import { Injectable } from '@nestjs/common';
import { map, Observable, pipe, tap } from 'rxjs';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
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
        PREFIX VDI3682: <http://www.w3id.org/hsu-aut/VDI3682#>
        
        SELECT DISTINCT ?objectProperty WHERE {
            # That's a killer query that can retrieve domain classes even if they are complex ones 
            # (e.g. a unionOf multiple classes). Just looking for the domain would in this case return
            # a blank node. With the chain matching, "unionOfs" are resolved.

            ?objectProperty rdfs:domain/(owl:unionOf/rdf:rest*/rdf:first)* ?domain.
            FILTER(?domain = <${domainClass}>)
        }`;
        
		return this.queryService.query(queryString).pipe(tap(console.log));
	}


	/**
     * Returns all classes that are in the range of a given property
     * @param propertyIri IRI of the property to get range class of
     * @param namespace (Optional). Filter for a certain namespace
     * @returns List of IRIs of classes that are in the range of the given property
     */
	public getRangeClasses(propertyIri: string, namespace =""): Observable<SparqlResponse> {
		const filterString = this.buildStringStartsFilter("class", namespace);
        
		const queryString = `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            
            SELECT ?rangeClass WHERE {
                # Similar killer query compared to the one above. Resolves complec ranges (i.e. "unionOfs")
                ?property rdfs:range/(owl:unionOf/rdf:rest*/rdf:first)* ?rangeClass.
                
                # filter for given property, filter out all blank nodes and filter for given namespace
                FILTER(?property = <${propertyIri}>)
                FILTER(!ISBLANK (?rangeClass))
                ${filterString}
            }`;
            
		return this.queryService.query(queryString);
	}


	public getClassesInNamespace(namespace: string): Observable<SparqlResponse> {
		let filterString = "";
		if (namespace) {
			filterString = `FILTER(STRSTARTS(STR(?class), "${namespace}"))`;
		}
		const queryString = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            SELECT ?class WHERE {
                ?class a owl:Class.
                ${filterString}
            }`;

		return this.queryService.query(queryString);
	}

	public getObjectPropertiesInNamespace(namespace: string): Observable<SparqlResponse> {
		let filterString = "";
		if (namespace) {
			filterString = `FILTER(STRSTARTS(STR(?objprops), "${namespace}"))`;
		}
		const queryString = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            SELECT ?objprops WHERE {
                ?objprops a owl:ObjectProperty.
                ${filterString}
            }`;

		return this.queryService.query(queryString); 
	}


	public getDataPropertiesInNamespace(namespace: string): Observable<SparqlResponse> {
		let filterString = "";
		if (namespace) {
			filterString = `FILTER(STRSTARTS(STR(?dataprops), "${namespace}"))`;
		}
		const queryString = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            SELECT ?dataprops WHERE {
                ?dataprops a owl:DatatypeProperty.
                ${filterString}
            }`;

		return this.queryService.query(queryString); 
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
    
	/**
     * Get all individuals of a given class within a given namespace
     * @param classIri IRI of the class to get all individuals of
     * @param namespace Namespace to filter
     * @returns All individuals of a class within a namespace
     */
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
		if (filterValue !== "") {
			filterString = `FILTER(STRSTARTS(STR(?${varToFilter}), "${filterValue}"))`;
		}
		return filterString;
	}
    
}
