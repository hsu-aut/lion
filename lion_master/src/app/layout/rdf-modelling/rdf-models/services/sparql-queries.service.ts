import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { PrefixesService } from './prefixes.service';
import { Tables } from '../../utils/tables';
import { FormatDescription } from '../../utils/formats';
import { DataLoaderService } from "../../../../shared/services/dataLoader.service";
import { DownloadService } from '../../rdf-models/services/download.service';
import { MessagesService } from "../../../../shared/services/messages.service";
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SparqlQueriesService {
  // util
  host: string;
  repository: string;
  TableUtil = new Tables();

  constructor(
    private http: HttpClient,
    private namespaceService: PrefixesService,
    private loadingScreenService: DataLoaderService,
    private messageService: MessagesService,
    private dlService: DownloadService
  ) {

    // default url
    this.host = 'lion_BE';
    this.repository = 'testdb';
    this.setNamedGraphs();
  }

  // getter and setter for repository and host
  getHost() {
    return this.host;
  }
  setHost(hostName: string) {
    this.host = hostName;
  }
  getRepository() {
    return this.repository;
  }
  setRepository(repositoryName: string) {
    this.repository = repositoryName;
  }

  // getURL() {
  //   var url: string;
  //   return url = 'http://localhost:7200/repositories/' + this.repository;
  // }

  getQueryURL() {
    var url: string;
    return url = this.host + '/queries';
  }

  getUpdateURL() {
    var url: string;
    return url = this.host + '/queries/statements';
  }

  getGraphURL() {
    var url: string;
    return url = this.host + '/graphs';
  }

  getRepositoryURL() {
    var url: string;
    return url = this.host + '/repositories';
  }

  select(body) {

    let headers = new HttpHeaders().set('Accept', 'text/plain')
    let params = new HttpParams().set('repositoryName', this.repository);

    var re = this.http.post(this.getQueryURL(), body, { headers, params });
    return re;

  }

  selectTable(SPARQL_Query: string) {
    var currentTable: Array<Object>;

    let headers = new HttpHeaders().set('Accept', 'text/plain')
    let params = new HttpParams().set('repositoryName', this.repository);

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

  selectList(Query, varPosition) {
    var currentList: Array<String>;

    let headers = new HttpHeaders().set('Accept', 'text/plain')
    let params = new HttpParams().set('repositoryName', this.repository);

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


  insert(body) {
    this.loadingScreenService.startLoading();

    let headers = new HttpHeaders().set('Content-Type', 'text/plain').set('Accept', 'text/plain')
    let params = new HttpParams().set('repositoryName', this.repository);

    var urlPOST = this.getUpdateURL();
    var GRAPHS = this.namespaceService.getGraphs();
    var graph = GRAPHS[this.namespaceService.getActiveGraph()];

    var insertObservable = new Observable((observer) => {
      this.http.post(urlPOST, body, { headers, params }).pipe(take(1)).subscribe((data: any) => {
        this.messageService.addMessage('success', 'Added!', `Added triples to the graph "${graph}"`);
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
    return this.selectTable(selectString);
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
    return this.selectList(selectString, 0);
  }

  getListOfRepositories() {
    var currentList: Array<String> = [];

    var listObservable = new Observable((observer) => {
      this.http.get(this.getRepositoryURL()).subscribe((data: any) => {

        for (let i = 0; i < data.results.bindings.length; i++) {

          currentList.push(data.results.bindings[i].id.value)

          if (i == (data.results.bindings.length - 1)) {
            observer.next(currentList)
            observer.complete()
          }
        }
      });
    })

    return listObservable;
  }

  setNamedGraphs() {
    let GRAPHS = this.namespaceService.getGraphs();
    let activeGraph = GRAPHS[this.namespaceService.getActiveGraph()]
    var selectString = `
    SELECT DISTINCT ?g 
    WHERE {
    GRAPH ?g { ?s ?p ?o }
    }`;
    this.namespaceService.GRAPHS.splice(0)
    this.selectList(selectString, 0).subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.namespaceService.GRAPHS.push(data[i]);
      }
      if (this.namespaceService.GRAPHS.length == 0) { this.namespaceService.GRAPHS.push(activeGraph) }
    });
  }

  getTriplesOfNamedGraph(graph: string, format: FormatDescription) {

    let headers = new HttpHeaders().set('Accept', format.MIME_type)
    let params = new HttpParams().set('graph', encodeURIComponent(graph)).set('repositoryName', this.repository);

    this.http.get(this.getGraphURL(), { headers, params }).pipe(take(1)).subscribe((data: string) => {
      if (format.fileEnding == '.json') {
        data = JSON.stringify(data)
      }
      // data = JSON.stringify(data)
      // console.log(data)
      const blob = new Blob([data], { type: 'text' });
      // Dateiname
      const name = graph + format.fileEnding;
      // Downloadservice
      this.dlService.download(blob, name);
    },
      (error) => {
        // as the Angular http client tries to parse the return as json, the error text has to be accessed. Using a returnType confuses the GraphDB...
        const blob = new Blob([error.error.text], { type: 'text' });
        // Dateiname
        const name = graph + format.fileEnding;
        // Downloadservice
        this.dlService.download(blob, name);
      })
  }



  deleteTriplesOfNamedGraph(graph: string) {
    // that is actually a put, accept should fit to type contained in the body that will be accepted by the db
    let headers = new HttpHeaders().set('Accept', 'text/turtle').set('Content-Type', 'text/plain')
    let params = new HttpParams().set('graph', encodeURIComponent(graph)).set('repositoryName', this.repository);

    // an empty body will clear the graph, a non empty body will insert triples that are in the body whatch for the mime type
    var body = "";

    var re = this.http.put(this.getGraphURL(), body, { headers, params });
    return re;
  }


  deleteNamedGraph(graph: string) {

    let params = new HttpParams().set('graph', encodeURIComponent(graph)).set('repositoryName', this.repository);

    var re = this.http.delete(this.getGraphURL(), {params});
    return re;
  }
}


