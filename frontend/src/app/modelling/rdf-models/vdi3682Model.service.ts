import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrefixesService } from '../../shared/services/prefixes.service';
import { QueriesService } from '../../shared/services/backEnd/queries.service';
import { GraphOperationsService } from '../../shared/services/backEnd/graphOperations.service';
import { DownloadService } from '../../shared/services/backEnd/download.service';
import { DataLoaderService } from '../../shared/services/dataLoader.service';
import { MessagesService } from '../../shared/services/messages.service';
import { take, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { toSparqlTable, toSparqlVariableList } from '../utils/rxjs-custom-operators';
import { SparqlResponse } from '../../../../interfaces/sparql/SparqlResponse';

@Injectable({
    providedIn: 'root'
})
export class Vdi3682ModelService {

    vdi3682insert = new VDI3682INSERT();

    constructor(
        private http: HttpClient,
        private query: QueriesService,
        private nameService: PrefixesService,
        private loadingScreenService: DataLoaderService,
        private messageService: MessagesService,
        private downloadService: DownloadService,
        private graphs: GraphOperationsService
    ) {}


    /**
     * Loads complete process info (for table below new individual form)
     * @returns A table-like structure of all processes and their inputs / outputs
     */
    public getCompleteProcessInfo(): Observable<Array<Record<string, string>>> {
        return this.http.get<SparqlResponse>("/lion_BE/fpb/process-info").pipe(toSparqlTable(), take(1));
    }


    /**
     * Get all properties that have a certain domain
     * @param domainClass OWL class that might be the domain of some properties
     * @returns All properties that have the given class as their domain
     */
    public getPropertiesByDomain(domainClass: string): Observable<Array<string>> {
        this.loadingScreenService.startLoading();
        domainClass = this.nameService.parseToIRI(domainClass);

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
        this.loadingScreenService.startLoading();
        const propertyIri = this.nameService.parseToIRI(property);
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
    public getClassOfIndividualWithinNamespace(individual: string): Observable<Array<string>> {
        const individualIri = this.nameService.parseToIRI(individual);

        // Construct Params Object
        let params = new HttpParams();
        params = params.append('individual', individualIri);
        params = params.append('namespace', "http://www.hsu-ifa.de/ontologies/VDI3682#"); // TODO: Better just use a prefix and let this get resolved by a service

        return this.http.get<SparqlResponse>("/lion_BE/t-box/classes-of-individual", {params: params})
            .pipe(toSparqlVariableList(), take(1));
    }


    /**
     * Get a list of all individuals of a class within a certain namespace
     * @param owlClass IRI of an OWL class to get all individuals of
     * @returns List of all individual of the given class
     */
    public getListOfIndividualsByClass(owlClass: string): Observable<Array<string>> {
        const owlClassIri = this.nameService.parseToIRI(owlClass);

        // Construct Params Object
        let params = new HttpParams();
        params = params.append('class', owlClassIri);
        params = params.append('namespace', "http://www.hsu-ifa.de/ontologies/VDI3682#");

        return this.http.get<SparqlResponse>("/lion_BE/t-box/individuals-by-class", {params: params}).pipe(toSparqlVariableList(), take(1));
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


    public getListOfAllClasses(): Observable<Array<string>> {
        return this.http.get<Array<string>>("/lion_BE/fpb/classes").pipe(take(1), toSparqlVariableList());
    }


    public modifyTripel(variables: Triple, action: string) {

        const GRAPHS = this.graphs.getGraphs();
        const activeGraph = GRAPHS[this.graphs.getActiveGraph()];

        switch (action) {
        case "add": {
            return this.query.SPARQL_UPDATE(this.vdi3682insert.createEntity(variables, activeGraph));
        }
        case "delete": {
            this.messageService.addMessage('warning', 'Sorry!', 'This feature has not been implemented yet');
            break;
        }
        case "build": {
            const blobObserver = new Observable((observer) => {
                const insertString = this.vdi3682insert.createEntity(variables, activeGraph);
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


export class Triple {
    subject: string;
    predicate: string;
    object: string;
}

export class VDI3682VARIABLES {
    simpleStatement: Triple

}

export class VDI3682INSERT {

    public createEntity(graph: Triple, activeGraph: string) {

        const insertString = `
	  INSERT {
		GRAPH <${activeGraph}>{
			?subject ?predicate ?object;
			a owl:NamedIndividual.}
	  } WHERE {
		  BIND(IRI(STR("${graph.subject}")) AS ?subject).
		  BIND(IRI(STR("${graph.predicate}")) AS ?predicate).
		  BIND(IRI(STR("${graph.object}")) AS ?object).
	  }`;
        console.log(insertString);
        return insertString;
    }


}
