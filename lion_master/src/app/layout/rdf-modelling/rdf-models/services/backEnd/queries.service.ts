import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { take } from 'rxjs/operators';

import { PrefixesService } from '../prefixes.service';
import { Tables } from '../../../utils/tables';
import { DataLoaderService } from "../../../../../shared/services/dataLoader.service";
import { MessagesService } from "../../../../../shared/services/messages.service";
import { ConfigurationService } from './configuration.service';



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
    private loadingScreenService: DataLoaderService,
    private messageService: MessagesService,
    private config: ConfigurationService
  ) {  }

  private getQueryURL() {
    return this.config.getHost() + '/queries';
  }

  private getUpdateURL() {
    return this.config.getHost() + '/queries/statements';
  }

  /* SPARQL QUERY OPERATIONS */

  SPARQL_SELECT(body) {

    let headers = new HttpHeaders().set('Accept', 'text/plain')
    let params = new HttpParams().set('repositoryName', this.config.getRepository());

    var re = this.http.post(this.getQueryURL(), body, { headers, params });
    return re;

  }

  SPARQL_SELECT_TABLE(SPARQL_Query: string) {
    var currentTable: Array<Object>;

    let headers = new HttpHeaders().set('Accept', 'text/plain')
    let params = new HttpParams().set('repositoryName', this.config.getRepository());

    var tableObservable = new Observable((observer) => {
      this.http.post(this.getQueryURL(), SPARQL_Query, { headers, params }).subscribe((data: any) => {
        this.namespaceService.parseToPrefix(data);
        currentTable = this.TableUtil.buildTable(data)
        observer.next(currentTable)
        observer.complete()
      },
        error => {
          this.messageService.addMessage('error', 'Ups!', `Seams like the Server responded with a ${error.status}`);
          this.loadingScreenService.stopLoading();
        });
    })

    return tableObservable;
  }

  SPARQL_SELECT_LIST(Query, varPosition) {
    var currentList: Array<String>;

    let headers = new HttpHeaders().set('Accept', 'text/plain')
    let params = new HttpParams().set('repositoryName', this.config.getRepository());

    var tableObservable = new Observable((observer) => {
      this.http.post(this.getQueryURL(), Query, { headers, params }).subscribe((data: any) => {
        this.namespaceService.parseToPrefix(data);
        currentList = this.TableUtil.buildList(data, varPosition)
        observer.next(currentList)
        observer.complete()
      },
        error => {
          this.messageService.addMessage('error', 'Ups!', `Seams like the Server responded with a ${error.status} code`);
          this.loadingScreenService.stopLoading();
        });
    })

    return tableObservable;
  }


  SPARQL_UPDATE(body) {
    this.loadingScreenService.startLoading();

    let headers = new HttpHeaders().set('Content-Type', 'text/plain').set('Accept', 'text/plain')
    let params = new HttpParams().set('repositoryName', this.config.getRepository());

    var urlPOST = this.getUpdateURL();
    // var GRAPHS = this.graphs.getGraphs();
    // var graph = GRAPHS[this.graphs.getActiveGraph()];

    var insertObservable = new Observable((observer) => {
      this.http.post(urlPOST, body, { headers, params }).pipe(take(1)).subscribe((data: any) => {
        this.messageService.addMessage('success', 'Added!', `Added triples to the active graph`);
        observer.next()
        observer.complete()
      },
        error => {
          this.messageService.addMessage('error', 'Ups!', `Seams like the Server responded with a ${error.status} code`);
          this.loadingScreenService.stopLoading();
        });
    })

    return insertObservable;
  }

  /* REUSABLE QUERY OPERATIONS */

  getRelatedTriples(subject) {
    subject = this.namespaceService.parseToIRI(subject)
    var selectString = `
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
    return this.SPARQL_SELECT_TABLE(selectString);
  }

  getTriplesCount(Namespace) {
    Namespace = this.namespaceService.parseToIRI(Namespace)
    var selectString = `
    SELECT ?subject ?object
    WHERE {
    ?subject a ?object.
    FILTER(STRSTARTS(STR(?object), "${Namespace}"))
    }
    `;
    return this.SPARQL_SELECT_LIST(selectString, 0);
  }


}
