import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { SparqlResponse } from '../../../../models/sparql/SparqlResponse';
import { PrefixesService } from '../../shared/services/prefixes.service';
import { toSparqlVariableList } from '../utils/rxjs-custom-operators';

/**
 * A service that offers basic interactions on T-Box level such as getting all classes (within a certain namespace)
 */
@Injectable({
    providedIn: 'root'
})
export class TboxService {

    constructor(
        private prefixService: PrefixesService,
        private http: HttpClient
    ) {}


    /**
     * Get a list of all individuals of a class within a certain namespace
     * @param owlClass IRI of an OWL class to get all individuals of
     * @returns List of all individual of the given class
     */
    public getListOfIndividualsByClass(owlClass: string, namenspace: string): Observable<Array<string>> {
        const owlClassIri = this.prefixService.parseToIRI(owlClass);

        // Construct Params Object
        let params = new HttpParams();
        params = params.append('class', owlClassIri);
        params = params.append('namespace', namenspace);

        return this.http.get<SparqlResponse>("/lion_BE/t-box/individuals-by-class", {params: params}).pipe(toSparqlVariableList(), take(1));
    }

}
