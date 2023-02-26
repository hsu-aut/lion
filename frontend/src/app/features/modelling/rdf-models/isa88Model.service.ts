import { Injectable } from '@angular/core';
import { GraphOperationsService } from '@shared-services/backEnd/graphOperations.service';
import { PrefixesService } from '@shared-services/prefixes.service';
import { map, switchMap, take } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { toSparqlTable } from '../utils/rxjs-custom-operators';
import { Observable } from 'rxjs';
import { DownloadService } from '@shared-services/backEnd/download.service';

@Injectable({
    providedIn: 'root'
})
export class Isa88ModelService {

        ALL_BEHAVIOR_INFO_TABLE: Array<Record<string, any>> = []

        constructor(
            private dlService: DownloadService,
            private http: HttpClient,
            private nameService: PrefixesService,
            private graphService: GraphOperationsService

        ) { }

        public getISA88BehaviorInfoTable():  Observable<Array<Record<string, string>>> {
            return this.http.get<SparqlResponse>("/lion_BE/isa88/behaviorInfoTable").pipe(toSparqlTable(), take(1));
        }

        public buildISA88(SystemName: string, mode: string, action: string): Observable<void> {

            const namespace: string = this.nameService.getActiveNamespace().namespace;

            return this.graphService.getActiveGraph().pipe(switchMap(activeGraph => {

                const parsedSystemName: string  = this.nameService.parseToName(SystemName);
                const parsedSystemIRI: string  = this.nameService.parseToIRI(SystemName);

                switch (action) {
                case "add": {
                    const params = new HttpParams()
                        .append("activeNameSpace", namespace)
                        .append("activeGraph", activeGraph)
                        .append("SystemName", parsedSystemName)
                        .append("mode", mode)
                        .append("SystemIRI", parsedSystemIRI)
                        .append("action", "add");
                    // console.log(params);
                    // TODO: request does not work yet
                    return this.http.get<void>("lion_BE/isa88/buildISA88", {params: params});
                }
                case "delete": {
                    console.log("not implemented yet");
                    break;
                }
                case "build": {
                    const params = new HttpParams()
                        .append("activeNameSpace", namespace)
                        .append("activeGraph", activeGraph)
                        .append("SystemName", parsedSystemName)
                        .append("mode", mode)
                        .append("SystemIRI", parsedSystemIRI)
                        .append("action", "build");
                    // console.log(params);
                    // TODO: request does not work yet
                    return this.http.get<string>("lion_BE/isa88/buildISA88", {params: params, responseType: 'text' as 'json'}).pipe(map((response: string) => {
                        const blob: Blob = new Blob([response], { type: 'text/plain' });
                        const name = 'insert.txt';
                        return this.dlService.download(blob, name);
                    }));
                }
                }
            }));
        }

}
