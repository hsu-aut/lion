import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PrefixesService } from './prefixes.service';
import { Tables } from '../../utils/tables';
import { DataLoaderService } from "../../../../shared/services/dataLoader.service";

//const url = `http://localhost:7200/repositories/Airbus_CTC_01`;



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
    private loadingScreenService: DataLoaderService
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
  // setURL(host: string, repository) {
  //   this.url = host + '/repositories/' + repository;
  // }

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
      });
    })

    return tableObservable;
  }

  insert(body) {

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/sparql-update'
      })
    };
    var urlPOST = this.getURL() + "/statements";
    var re = this.http.post(urlPOST, body, httpOptions);
    return re;
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

    var selectString = `
    SELECT DISTINCT ?g 
    WHERE {
    GRAPH ?g { ?s ?p ?o }
    }`;

    this.selectList(selectString, 0).subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.namespaceService.GRAPHS.push(data[i]);
      }
    });
  }

  getTriplesOfNamedGraph(graph: string) {

    var namedGraphURL_encoded = encodeURIComponent(graph);
    console.log(namedGraphURL_encoded)
    var url = this.getURL() + `/rdf-graphs/service?graph=${namedGraphURL_encoded}`;
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-turtle',
        'Accept': 'application/x-turtle',

      })
    };
    var options = { httpOptions, responseType: 'text' as 'text' }

    var re = this.http.get(url, options);
    return re;
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



