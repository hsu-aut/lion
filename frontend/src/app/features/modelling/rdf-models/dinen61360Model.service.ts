import { Injectable } from '@angular/core';
import { GraphOperationsService } from '@shared-services/backEnd/graphOperations.service';
import { DownloadService } from '@shared-services/backEnd/download.service';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { DINEN61360Variables } from '@shared/models/dinen61360-variables.interface';
import { toSparqlTable, toSparqlVariableList } from '../utils/rxjs-custom-operators';

@Injectable({
    providedIn: 'root'
})
export class Dinen61360Service {

    constructor(

        private http: HttpClient,
        private graphs: GraphOperationsService,
        private dlService: DownloadService,

    ) { }

    // getters
    public getTableOfAllTypes(): Observable<Array<Record<string, string>>> {
        return this.http.get<SparqlResponse>("lion_BE/dinen61360/getAllTypes").pipe(toSparqlTable(), take(1));
    }
    public getListOfAllDE(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("lion_BE/dinen61360/getAllDE").pipe(toSparqlVariableList(), take(1));
    }
    public getListOfAllDET(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("lion_BE/dinen61360/getAllDET").pipe(toSparqlVariableList(), take(1));
    }
    public getListOfAllDEI(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("lion_BE/dinen61360/getAllDEI").pipe(toSparqlVariableList(), take(1));
    }
    public getListOfDataTypes(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("lion_BE/dinen61360/getDataTypes").pipe(toSparqlVariableList(), take(1));
    }
    public getTableOfAllInstanceInfo(): Observable<Array<Record<string, string>>> {
        return this.http.get<SparqlResponse>("lion_BE/dinen61360/getAllInstanceInfo").pipe(toSparqlTable(), take(1));
    }
    public getListOfExpressionGoals(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("lion_BE/dinen61360/getExpressionGoals").pipe(toSparqlVariableList(), take(1));
    }
    public getListOfLogicInterpretations(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("lion_BE/dinen61360/getLogicInterpretations").pipe(toSparqlVariableList(), take(1));
    }

    // builders
    public modifyInstance(action: string, variables: DINEN61360Variables): Observable<void> {
        switch (action) {
        case "add": {
            const params = new HttpParams()
                .append("action", "add");
            return this.http.post<void>("lion_BE/dinen61360/modifyInstance", variables, {params: params});
        }
        case "delete": {
            console.log("not implemented yet");
            break;
        }
        case "build": {
            const params = new HttpParams()
                .append("action", "build");
            return this.http.post<string>("lion_BE/dinen61360/modifyInstance", variables, {params: params, responseType: 'text' as 'json'})
                .pipe(map((response: string) => {
                    const blob = new Blob([response], { type: 'text/plain' });
                    const name = 'insert.txt';
                    return this.dlService.download(blob, name);
                }));
        }
        }
    }


    public modifyType(action: string, variables: DINEN61360Variables): Observable<void> {
        switch (action) {
        case "add": {
            const params = new HttpParams()
                .append("action", "add");
            return this.http.post<void>("lion_BE/dinen61360/modifyType", variables, {params: params});
        }
        case "delete": {
            console.log("not implemented yet");
            break;
        }
        case "build": {
            const params = new HttpParams()
                .append("action", "build");
            return this.http.post<string>("lion_BE/dinen61360/modifyType", variables, {params: params, responseType: 'text' as 'json'})
                .pipe(map((response: string) => {
                    const blob = new Blob([response], { type: 'text/plain' });
                    const name = 'insert.txt';
                    return this.dlService.download(blob, name);
                }));
        }
        }
    }

}
