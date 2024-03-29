import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrefixesService } from '@shared-services/prefixes.service';
import { GraphOperationsService } from '@shared-services/backEnd/graphOperations.service';
import { DownloadService } from '@shared-services/backEnd/download.service';
import { MessagesService } from '@shared-services/messages.service';
import { switchMap, take } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { toSparqlTable, toSparqlVariableList } from '../utils/rxjs-custom-operators';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { Triple, TripleService } from './triple.service';

@Injectable({
    providedIn: 'root'
})
export class Vdi3682ModelService {

    constructor(
        private http: HttpClient,
        private tripleService: TripleService,
        private nameService: PrefixesService,
        private messageService: MessagesService,
        private downloadService: DownloadService,
        private graphService: GraphOperationsService
    ) {}


    /**
     * Loads complete process info (for table below new individual form)
     * @returns A table-like structure of all processes and their inputs / outputs
     */
    public getCompleteProcessInfo(): Observable<Array<Record<string, string>>> {
        return this.http.get<SparqlResponse>("/lion_BE/fpb/process-info").pipe(toSparqlTable(), take(1));
    }

    /**
     * Get a list of all Processes according to VDI 3682
     * @returns A list of processes
     */
    public getListOfProcesses(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("/lion_BE/fpb/processes").pipe(toSparqlVariableList(), take(1));
    }

    /**
     * Get a list of all Technical Resources according to VDI 3682
     * @returns A list of technical resources
     */
    public getListOfTechnicalResources(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("/lion_BE/fpb/technical-resources").pipe(toSparqlVariableList(), take(1));
    }

    /**
     * Get a list of all inputs and outputs (i.e. individuals of class State) according to VDI 3682
     * @returns A list of inputs / outputs
     */
    public getListOfInputsAndOutputs(): Observable<Array<string>> {
        return this.http.get<SparqlResponse>("/lion_BE/fpb/inputs-outputs").pipe(toSparqlVariableList(), take(1));
    }


    /**
     * Get a list of all classes of VDI 3682
     * @returns List of all classes defined in VDI 3682 ODP
     */
    public getListOfAllClasses(): Observable<Array<string>> {
        return this.http.get<Array<string>>("/lion_BE/fpb/classes").pipe(take(1), toSparqlVariableList());
    }


    public modifyTripel(triple: Triple, action: string) {
        switch (action) {
        case "add": {
            return this.tripleService.addTriple(triple);
        }
        case "delete": {
            this.messageService.warn('Sorry!', 'This feature has not been implemented yet');
            break;
        }
        case "build": {
            const blobObserver = new Observable((observer) => {
                const insertString = this.tripleService.buildTripleInsertString(triple);
                const blob = new Blob([insertString], { type: 'text/plain' });
                const name = 'insert.txt';
                this.downloadService.download(blob, name);
                observer.next();
                observer.complete();
            });
            return blobObserver;

        }
        }
    }
}
