import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { PrefixesService } from '@shared-services/prefixes.service';
import { toSparqlVariableList } from '../utils/rxjs-custom-operators';

/**
 * A service that offers basic interactions on T-Box level such as getting all classes (within a certain namespace)
 */
@Injectable({
    providedIn: 'root'
})
export class TboxService {

    baseUrl = "/lion_BE/t-box"

    constructor(
        private prefixService: PrefixesService,
        private http: HttpClient
    ) {}

    public getClassesWithinNamespace(namespace: string): Observable<Array<string>> {
        const encodedNs = encodeURIComponent(namespace);
        const url = `${this.baseUrl}/classes-in-namespace/${encodedNs}`;
        return this.http.get(url).pipe(toSparqlVariableList("class"));
    }

    public getObjectPropertiesWithinNamespace(namespace: string): Observable<Array<string>> {
        const encodedNs = encodeURIComponent(namespace);
        const url = `${this.baseUrl}/objectproperties-in-namespace/${encodedNs}`;
        return this.http.get(url).pipe(toSparqlVariableList("objprops"));
    }

    public getDataPropertiesWithinNamespace(namespace: string): Observable<Array<string>> {
        const encodedNs = encodeURIComponent(namespace);
        const url = `${this.baseUrl}/dataproperties-in-namespace/${encodedNs}`;
        return this.http.get(url).pipe(toSparqlVariableList("dataprops"));
    }

    /**
     * Get a list of all individuals of a class within a certain namespace
     * @param owlClass IRI of an OWL class to get all individuals of
     * @returns List of all individual of the given class
     */
    public getListOfIndividualsByClass(owlClass: string, namenspace: string): Observable<Array<string>> {
        const url = `${this.baseUrl}/individuals-by-class`;
        const owlClassIri = this.prefixService.parseToIRI(owlClass);

        // Construct Params Object
        let params = new HttpParams();
        params = params.append('class', owlClassIri);
        params = params.append('namespace', namenspace);

        return this.http.get<SparqlResponse>(url, {params: params}).pipe(toSparqlVariableList(), take(1));
    }


    /**
     * Get all properties that have a certain domain
     * @param domainClass OWL class that might be the domain of some properties
     * @returns All properties that have the given class as their domain
     */
    public getPropertiesByDomain(domainClass: string): Observable<Array<string>> {
        domainClass = this.prefixService.parseToIRI(domainClass);

        // Construct Params Object
        let params = new HttpParams();
        params = params.append('domainClass', domainClass);
        params = params.append('namespace', "http://www.hsu-ifa.de/ontologies/VDI3682#"); // TODO: Better just use a prefix and let this get resolved by a service

        return this.http.get<SparqlResponse>("/lion_BE/t-box/properties-by-domain", {params: params}).pipe(toSparqlVariableList(), take(1));
    }

    /**
 * Return all classes that are in the range of a given property
 * @param property The propery to get all range classes for
 * @returns All classes that are in the range of the given property
 */
    public getRangeClasses(property: string): Observable<Array<string>> {
        const propertyIri = this.prefixService.parseToIRI(property);
        // Construct Params Object
        let params = new HttpParams();
        params = params.append('property', propertyIri);
        params = params.append('namespace', "http://www.hsu-ifa.de/ontologies/VDI3682#"); // TODO: Better just use a prefix and let this get resolved by a service
        return this.http.get<SparqlResponse>("/lion_BE/t-box/range-classes", {params: params}).pipe(toSparqlVariableList(), take(1));
    }


    /**
 * Get classes of an individual with a certain namenspace
 * @param individual IRI of an individual that all classes will be returned for
 * @returns List of classes of the given individual. Note that only classes with a given Namespace are considered
 */
    public getClassOfIndividualWithinNamespace(individual: string, namespace: string): Observable<Array<string>> {
        const individualIri = this.prefixService.parseToIRI(individual);

        // Construct Params Object
        let params = new HttpParams();
        params = params.append('individual', individualIri);
        params = params.append('namespace', namespace); // TODO: Better just use a prefix and let this get resolved by a service

        return this.http.get<SparqlResponse>("/lion_BE/t-box/classes-of-individual", {params: params})
            .pipe(toSparqlVariableList(), take(1));
    }


}
