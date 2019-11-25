import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { PrefixesService } from './prefixes.service';
import { Tables } from '../../utils/tables';
import { FormatDescription } from '../../utils/formats';
import { DataLoaderService } from "../../../../shared/services/dataLoader.service";
import { DownloadService } from '../../rdf-models/services/download.service';
import { MessagesService } from "../../../../shared/services/messages.service";
import { take } from 'rxjs/operators';
import { error } from 'util';


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
    this.host = 'http://localhost:7200';
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
  getURL() {
    var url: string;
    return url = this.host + '/repositories/' + this.repository;
  }

  select(body) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/sparql-query'
      })
    };
    var re = this.http.post(this.getURL(), body, httpOptions);
    return re;

  }
  selectTable(Query) {
    var currentTable: Array<Object>;
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/sparql-query'
      })
    };

    var tableObservable = new Observable((observer) => {
      this.http.post(this.getURL(), Query, httpOptions).subscribe((data: any) => {

        this.namespaceService.parseToPrefix(data);
        currentTable = this.TableUtil.buildTable(data)
        observer.next(currentTable)
        observer.complete()
      },
        error => {
          this.messageService.addMessage('error', 'Ups!', `Seams like the GraphDB responded with a ${error.status}`);
          this.loadingScreenService.stopLoading();
        });
    })

    return tableObservable;
  }

  selectList(Query, varPosition) {
    var currentList: Array<String>;
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/sparql-query'
      })
    };

    var tableObservable = new Observable((observer) => {
      this.http.post(this.getURL(), Query, httpOptions).subscribe((data: any) => {
        this.namespaceService.parseToPrefix(data);
        currentList = this.TableUtil.buildList(data, varPosition)
        observer.next(currentList)
        observer.complete()
      },
        error => {
          this.messageService.addMessage('error', 'Ups!', `Seams like the GraphDB responded with a ${error.status} code`);
          this.loadingScreenService.stopLoading();
        });
    })

    return tableObservable;
  }

  insert(body) {
    this.loadingScreenService.startLoading();
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/sparql-update'
      })
    };
    var urlPOST = this.getURL() + "/statements";
    var GRAPHS = this.namespaceService.getGraphs();
    var graph = GRAPHS[this.namespaceService.getActiveGraph()];
    var insertObservable = new Observable((observer) => {
      this.http.post(urlPOST, body, httpOptions).pipe(take(1)).subscribe((data: any) => {
        this.messageService.addMessage('success', 'Added!', `Added triples to the graph "${graph}"`);
        observer.next()
        observer.complete()
      },
        error => {
          this.messageService.addMessage('error', 'Ups!', `Seams like the GraphDB responded with a ${error.status} code`);
          this.loadingScreenService.stopLoading();
        });
    })
    
    // var re = this.http.post(urlPOST, body, httpOptions);
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
    var url = this.host + "/repositories";
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/sparql-results+json, */*;q=0.5'
      })
    };

    var listObservable = new Observable((observer) => {
      this.http.get(url, httpOptions).subscribe((data: any) => {

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

    

    var namedGraphURL_encoded = encodeURIComponent(graph);
    var url = this.getURL() + `/rdf-graphs/service?graph=${namedGraphURL_encoded}`;
    var httpOptions = {
      headers: new HttpHeaders({
        'Accept': format.MIME_type
      })
    };
    this.http.get(url, httpOptions).pipe(take(1)).subscribe((data: string) => {
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
    var body = "";
    var namedGraphURL_encoded = encodeURIComponent(graph);
    console.log(namedGraphURL_encoded)
    var url = this.getURL() + `/rdf-graphs/service?graph=${namedGraphURL_encoded}`;
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-turtle',
        'Accept': 'application/x-turtle'
      })
    };

    var re = this.http.put(url, body, httpOptions);
    return re;
  }

  deleteNamedGraph(graph: string) {

    var namedGraphURL_encoded = encodeURIComponent(graph);
    console.log(namedGraphURL_encoded)
    var url = this.getURL() + `/rdf-graphs/service?graph=${namedGraphURL_encoded}`;
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-turtle',
        'Accept': 'application/x-turtle'
      })
    };

    var re = this.http.delete(url, httpOptions);
    return re;
  }
}



