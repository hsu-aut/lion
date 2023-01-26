import { Injectable } from '@angular/core';
import { PrefixesService } from '@shared-services/prefixes.service';
import { GraphOperationsService } from '@shared-services/backEnd/graphOperations.service';
import { DownloadService } from '@shared-services/backEnd/download.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ISO224002ElementVariables, ISO224002KPIVariables } from '@shared/models/iso224002-variables.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { toSparqlTable, toSparqlVariableList } from '../utils/rxjs-custom-operators';

@Injectable({
    providedIn: 'root'
})
export class Iso22400_2ModelService {

    constructor(

    private http: HttpClient,
    private dlService: DownloadService,
    private nameService: PrefixesService,
    private graphs: GraphOperationsService

    ) { }

    // getters
    public getTableOfAllEntityInfo(): Observable<Array<Record<string, string>>> {
        return this.http.get<SparqlResponse>("/lion_BE/iso224002/allEntityInfo").pipe(toSparqlTable(), take(1));
    }
    public getListOfKPIGroups(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("/lion_BE/iso224002/kpiGroups").pipe(toSparqlVariableList(), take(1));
    }
    public getListOfKPIs(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("/lion_BE/iso224002/listKPIs").pipe(toSparqlVariableList(), take(1));
    }
    public getListOfOrganizationalElements(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("/lion_BE/iso224002/orgElements").pipe(toSparqlVariableList(), take(1));
    }
    public getListOfNonOrganizationalElements(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("/lion_BE/iso224002/nonOrgElements").pipe(toSparqlVariableList(), take(1));
    }
    public getListOfElementGroups(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("/lion_BE/iso224002/elementGroups").pipe(toSparqlVariableList(), take(1));
    }
    public getListOfOrganizationalElementClasses(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("/lion_BE/iso224002/orgElementClasses").pipe(toSparqlVariableList(), take(1));
    }
    public getTableOfElements(): Observable<Array<Record<string, string>>> {
        return this.http.get<SparqlResponse>("/lion_BE/iso224002/elements").pipe(toSparqlTable(), take(1));
    }
    public getTableOfKPIs(): Observable<Array<Record<string, string>>> {
        return this.http.get<SparqlResponse>("/lion_BE/iso224002/tableKPIs").pipe(toSparqlTable(), take(1));
    }
    public getListOfElementsByGroup(groupNameIRI: string): Observable<Array<string>> {
        const params = new HttpParams()
            .append("constrDataProp", this.nameService.parseToIRI(groupNameIRI));
        console.log(params.toString);
        return this.http.get<SparqlResponse>("/lion_BE/iso224002/listElementsByGroup", {params: params}).pipe(toSparqlVariableList(), take(1));
    }
    public getListOfClassConstraintEnum(KPIClass: string, ConstrainingDataProperty: string): Observable<Array<string>> {
        const params = new HttpParams()
            .append("kpiClass", this.nameService.parseToIRI(KPIClass))
            .append("constrDataProp", this.nameService.parseToIRI(ConstrainingDataProperty));
        console.log(params.toString);
        return this.http.get<SparqlResponse>("/lion_BE/iso224002/listClassConstraints", {params: params}).pipe(toSparqlVariableList(), take(1));
    }

    // builders
    public createElement(variables: ISO224002ElementVariables, action: string): Observable<void> {
        const GRAPHS: Array<string> = this.graphs.getGraphs();
        const activeGraph: string = GRAPHS[this.graphs.getActiveGraph()];
        switch (action) {
        case "add": {
            const params = new HttpParams()
                .append("action", "add")
                .append("activeGraph", activeGraph);
            return this.http.post<void>("lion_BE/iso224002/createElement", variables, {params: params});
        }
        case "delete": {
            console.log("not implemented yet");
            break;
        }
        case "build": {
            const params = new HttpParams()
                .append("action", "build")
                .append("activeGraph", activeGraph);
            return this.http.post<string>("lion_BE/iso224002/createElement", variables, {params: params, responseType: 'text' as 'json'}).pipe(map((response: string) => {
                const blob = new Blob([response], { type: 'text/plain' });
                const name = 'insert.txt';
                return this.dlService.download(blob, name);
            }));
        }
        }
    }
    public createKPI(variables: ISO224002KPIVariables, action: string): Observable<void> {
        const GRAPHS: Array<string> = this.graphs.getGraphs();
        const activeGraph: string = GRAPHS[this.graphs.getActiveGraph()];
        switch (action) {
        case "add": {
            const params = new HttpParams()
                .append("action", "add")
                .append("activeGraph", activeGraph);
            return this.http.post<void>("lion_BE/iso224002/createKPI", variables, {params: params});
        }
        case "delete": {
            console.log("not implemented yet");
            break;
        }
        case "build": {
            const params = new HttpParams()
                .append("action", "build")
                .append("activeGraph", activeGraph);
            return this.http.post<string>("lion_BE/iso224002/createKPI", variables, {params: params, responseType: 'text' as 'json'}).pipe(map((response: string) => {
                const blob = new Blob([response], { type: 'text/plain' });
                const name = 'insert.txt';
                return this.dlService.download(blob, name);
            }));
        }
        }
    }

}

// TODO: move to iso22400-2.component.ts ??? --> should components import stuff from @shared folder?
export class ISO224002Variables {
  simpleElement: ISO224002ElementVariables
  KPI: ISO224002KPIVariables
}
