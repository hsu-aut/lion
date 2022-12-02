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
    
    getAllClasses(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("lion_BE/generic-odp/all-classes").pipe(toSparqlVariableList(), take(1));
    }

    getAllIndividualsOfClass(classIri: string): Observable<Array<string>> {
        const params = new HttpParams()
            .append("classIri", classIri)
        return this.http.get<SparqlResponse>("lion_BE/generic-odp/all-ind-of-class", {params: params}).pipe(toSparqlVariableList(), take(1));
    }

}