import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PrefixesService } from './prefixes.service';
import { Tables } from '../../utils/tables';

//const url = `http://localhost:7200/repositories/Airbus_CTC_01`;



@Injectable({
  providedIn: 'root'
})
export class SparqlQueriesService {
  // util
  url: string;
  TableUtil = new Tables();


  constructor(
    private http: HttpClient,
    private namespaceService: PrefixesService
  ) {
    // new Hamied -> default url in constructor

    this.url = 'http://localhost:7200/repositories/testdb';

  }

  select(body) {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/sparql-query'
      })
    };
    var re = this.http.post(this.url, body, httpOptions);
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
      this.http.post(this.url, Query, httpOptions).subscribe((data: any) => {
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
      this.http.post(this.url, Query, httpOptions).subscribe((data: any) => {
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
    var urlPOST = this.url + "/statements";
    var re = this.http.post(urlPOST, body, httpOptions);
    return re;
  }

  // New Hamied -> Getter and Setter
  getUrl() {
    return this.url;
  }
  setUrl(url: string) {
    this.url = url;
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
    return this.select(selectString);
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
    return this.select(selectString);
  }




}


