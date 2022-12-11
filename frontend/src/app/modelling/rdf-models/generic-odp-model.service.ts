import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take } from "rxjs";
import { SparqlResponse } from "../../../../models/sparql/SparqlResponse";
import { DownloadService } from "../../shared/services/backEnd/download.service";
import { GraphOperationsService } from "../../shared/services/backEnd/graphOperations.service";
import { toSparqlVariableList } from "../utils/rxjs-custom-operators";

@Injectable({
    providedIn: 'root'
})
export class GenericOdpModelService {

    constructor(
        private http: HttpClient,
        private graphs: GraphOperationsService,
        private dlService: DownloadService,
    ) { }
    
    // request data
    public getAllClasses(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("lion_BE/generic-odp/all-classes").pipe(toSparqlVariableList(), take(1));
    }
    public getAllIndividuals(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("lion_BE/generic-odp/all-ind").pipe(toSparqlVariableList(), take(1));
    }
    public getAllIndividualsOfClass(classIri: string): Observable<Array<string>> {
        const params = new HttpParams()
            .append("classIri", classIri);
        return this.http.get<SparqlResponse>("lion_BE/generic-odp/ind-of-class", {params: params}).pipe(toSparqlVariableList(), take(1));
    }
    public getAllObjectPropertiesForDomainIndividual(individualIri: string): Observable<Array<string>> {
        const params = new HttpParams()
            .append("individualIri", individualIri);
        return this.http.get<SparqlResponse>("lion_BE/generic-odp/op-for-dom-ind", {params: params}).pipe(toSparqlVariableList(), take(1));
    }
    public getAllRangeIndividualsForObjectProperty(objectPropertyIri: string): Observable<Array<string>> {
        const params = new HttpParams()
            .append("objectPropertyIri", objectPropertyIri);
        return this.http.get<SparqlResponse>("lion_BE/generic-odp/rng-ind-for-op", {params: params}).pipe(toSparqlVariableList(), take(1));
    }

    // create triples
    //

}