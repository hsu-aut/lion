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

    vdi3682data = new VDI3682DATA();
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
    // public loadLIST_OF_ALL_CLASSES() {
    //     this.loadingScreenService.startLoading();
    //     return this.query.SPARQL_SELECT_LIST(this.vdi3682data.SELECT_LIST_OF_ALL_CLASSES, 0);
    // }
    public loadPredicatesByDomain(owlClass: string) {
        this.loadingScreenService.startLoading();
        owlClass = this.nameService.parseToIRI(owlClass);

        // Construct Params Object
        let params = new HttpParams();
        params = params.append('domainClass', owlClass);
        params = params.append('namespace', "http://www.hsu-ifa.de/ontologies/VDI3682#"); // TODO: This could be done by some Prefix service

        return this.http.get<string[]>("/lion_BE/t-box/properties-by-domain", {params: params});
    }

    public getListOfClassesByRange(predicate: string): Observable<Array<string>> {
        this.loadingScreenService.startLoading();
        predicate = this.nameService.parseToIRI(predicate);
        // Construct Params Object
        let params = new HttpParams();
        params = params.append('predicate', predicate);
        return this.http.get<SparqlResponse>("/lion_BE/t-box/classes-by-range", {params: params}).pipe(toSparqlVariableList());
    }


    public getClassOfIndividualWithinNamespace(individual): Observable<Array<string>> {
        const individualIri = this.nameService.parseToIRI(individual);

        // Construct Params Object
        let params = new HttpParams();
        params = params.append('individual', individualIri);
        params = params.append('namespace', "http://www.hsu-ifa.de/ontologies/VDI3682#"); // TODO: This could be done by some Prefix service

        return this.http.get<string[]>("/lion_BE/t-box/classes-of-individual", {params: params});
    }


    public loadLIST_OF_INDIVIDUALS_BY_CLASS(Class) {
        this.loadingScreenService.startLoading();
        Class = this.nameService.parseToIRI(Class);
        return this.query.SPARQL_SELECT_LIST(this.vdi3682data.selectIndividualByClass(Class), 0);
    }

    public getListOfProcesses(): Observable<Array<string>> {
        return this.http.get<Array<string>>("/lion_BE/fpb/processes");
    }

    public getListOfTechnicalResources(): Observable<Array<string>> {
        return this.http.get<Array<string>>("/lion_BE/fpb/technical-resources");
    }
    public getListOfInputsAndOutputs(): Observable<Array<string>> {
        return this.http.get<Array<string>>("/lion_BE/fpb/inputs-outputs");
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

export class VDI3682DATA {



    //     public SELECT_TABLE_OF_PROCESS_INFO = `
    //   PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>

    //   PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    //   SELECT ?Process ?pShortName ?Input ?iShortName ?InputType ?Output ?oShortName ?OutputType ?TechnicalResource ?tShortName WHERE {
    //   ?Process a VDI3682:Process.
    //   OPTIONAL { ?Process VDI3682:shortName ?pShortName}

    //   OPTIONAL {?Process VDI3682:hasInput ?Input. OPTIONAL {?Input VDI3682:shortName ?iShortName.} ?Input rdf:type ?InputType. VALUES ?InputType {VDI3682:Product VDI3682:Energy VDI3682:Information}}
    //   OPTIONAL {?Process VDI3682:hasOutput ?Output. OPTIONAL {?Output VDI3682:shortName ?oShortName.} ?Output rdf:type ?OutputType. VALUES ?OutputType {VDI3682:Product VDI3682:Energy VDI3682:Information}}
    //   OPTIONAL {?TechnicalResource VDI3682:TechnicalResourceIsAssignedToProcessOperator ?Process. OPTIONAL {?TechnicalResource VDI3682:shortName ?tShortName.}}
    //   }
    // `


    //TODO: This seems to be exactly the same as in VDI2206Model.service (and possibly others). Should be moved to a common base class
    // public selectPredicateByDomain(owlClass: string): string {

    //     const selectString = `
    //         PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    //         PREFIX owl: <http://www.w3.org/2002/07/owl#>
    //         PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    //         SELECT ?ObjectProperty WHERE {
    //         ?ObjectProperty rdfs:domain ?domain.
    //         # optionally if the range is a blank node no changes required
    //         OPTIONAL {
    //             ?domain owl:unionOf ?c.
    //             ?c rdf:rest* ?e.
    //             ?e rdf:first ?first.
    //         }
    //         # in case the range is a blank node, use the rdf:first as return
    //         BIND(IF(isBlank(?a),?first,?domain) AS ?Property)
    //         # filter for class
    //         FILTER(?Property = IRI("${owlClass}"))
    //         }`;
    //     return selectString;
    // }

    //TODO: This seems to be exactly the same as in VDI2206Model.service (and possibly others). Should be moved to a common base class
    public selectClassByRange(predicate: string): string {
        const selectString = `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT ?Class WHERE {
            ?ObjectProperty rdfs:range ?a.
            # optionally if the range is a blank node not changes required
            OPTIONAL {    	?a owl:unionOf ?c.
                    ?c rdf:rest* ?e.
                    ?e rdf:first ?g.}
            # in case the range is a blank node, use the rdf:first as return
            BIND(IF(isBlank(?a),?g,?a) AS ?Class)
            # filter for class
            FILTER(?ObjectProperty = IRI("${predicate}"))
            FILTER(STRSTARTS(STR(?Class), "http://www.hsu-ifa.de/ontologies/VDI3682#"))
            }`;
        return selectString;
    }


    //     public selectClass(Individual) {

    //         const selectString = `
    // PREFIX owl: <http://www.w3.org/2002/07/owl#>
    // PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    // SELECT ?Class WHERE {
    //   BIND(IRI("${Individual}") AS ?Individual)
    //   ?Individual rdf:type ?Class.
    //   ?Class a owl:Class.
    //   FILTER(STRSTARTS(STR(?Class), "http://www.hsu-ifa.de/ontologies/VDI3682#"))
    // }
    // `;
    //         return selectString;
    //     }

    public selectIndividualByClass(Class) {
        const selectString = `
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?Individual WHERE {
BIND(IRI("${Class}") AS ?Class)
?Individual a ?Class.
FILTER(STRSTARTS(STR(?Class), "http://www.hsu-ifa.de/ontologies/VDI3682#"))
}`;
        return selectString;
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
