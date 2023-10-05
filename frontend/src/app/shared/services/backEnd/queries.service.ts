import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { take } from 'rxjs/operators';

import { PrefixesService } from '../prefixes.service';
import { Tables } from '../../../features/modelling/utils/tables';
import { DataLoaderService } from "../dataLoader.service";
import { MessagesService } from "../messages.service";
import { ConfigurationService } from './configuration.service';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { toSparqlTable, toSparqlVariableList } from '../../../features/modelling/utils/rxjs-custom-operators';



/* This service is relevant for query related interactions with the backend, e.g. SPARQL SELECT or UPDATE queries */

@Injectable({
    providedIn: 'root'
})
export class QueriesService {
    // util
    TableUtil = new Tables();

    constructor(
        private http: HttpClient,
        private namespaceService: PrefixesService,
        private messageService: MessagesService,
        private config: ConfigurationService
    ) { }

    private getQueryURL() {
        return this.config.getHost() + '/queries';
    }

    private getUpdateURL() {
        return this.config.getHost() + '/queries/statements';
    }

    /* SPARQL QUERY OPERATIONS */

    executeSelect(queryString: string): Observable<SparqlResponse> {

        const headers = new HttpHeaders().set('Accept', 'text/plain');
        const params = new HttpParams().set('repositoryName', this.config.getRepository());

        const response = this.http.post<SparqlResponse>(this.getQueryURL(), queryString, { headers, params });
        return response;
    }


    /**
     * Executes an update statement against the current repository
     * @param updateString Update string that will be executed
     * @returns
     */
    executeUpdate(updateString: string): Observable<void> {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain').set('Accept', 'text/plain');
        const params = new HttpParams().set('repositoryName', this.config.getRepository());

        const urlPOST = this.getUpdateURL();
        // var GRAPHS = this.graphs.getGraphs();
        // var graph = GRAPHS[this.graphs.getActiveGraph()];

        // TODO: There needs to be a way to do this better:
        // 1: A service should not subscribe
        // 2: Manually creating this observable seems weird / wrong
        // -> Check if this can be done using an interceptor
        const insertObservable = new Observable<void>((observer) => {
            this.http.post(urlPOST, updateString, { headers, params }).pipe(take(1)).subscribe((data: any) => {
                this.messageService.success('Done!',`Executed operation and updated the graph`);
                observer.next();
                observer.complete();
            },
            error => {
                this.messageService.warn('Ups!',`Seams like the Server responded with a ${error.status} code`);
            });
        });

        return insertObservable;
    }

    /* REUSABLE QUERY OPERATIONS */

    getRelatedTriples(subject: string) {
        subject = this.namespaceService.parseToIRI(subject);
        const selectString = `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT DISTINCT ?subject ?predicate ?object WHERE {
            BIND(IRI("${subject}") AS ?subject)
            ?subject ?predicate ?a.
            # optionally if the range is a blank node not changes required
            OPTIONAL {    	?a owl:unionOf ?c.
                    ?c rdf:rest* ?e.
                    ?e rdf:first ?g.}
            # in case the range is a blank node, use the rdf:first as return
            BIND(IF(isBlank(?a),?g,?a) AS ?object)
        }`;
        return this.executeSelect(selectString).pipe(toSparqlTable());
    }

    getTriplesCount(Namespace) {
        Namespace = this.namespaceService.parseToIRI(Namespace);
        const selectString = `
            SELECT ?subject ?object
            WHERE {
            ?subject a ?object.
            FILTER(STRSTARTS(STR(?object), "${Namespace}"))
            }`;
        return this.executeSelect(selectString).pipe(toSparqlVariableList())[0];
    }


}
