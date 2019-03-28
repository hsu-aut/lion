import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders }    from '@angular/common/http';


const url = `http://localhost:7200/repositories/Airbus_CTC_01`;


@Injectable({
  providedIn: 'root'
})
export class SparqlQueriesService {

  constructor( private http: HttpClient) { }

  select(body){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/sparql-query'
      })
    };
    
    // return this.http.post(url, body, httpOptions).pipe(tap((data: any) => data.json()));  
    console.log("Query executed");
    console.log(url, body, httpOptions);
    var re = this.http.post(url, body, httpOptions);
    console.log(re);
    return re;
      
  }

  insert(body){

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/sparql-update'
      })
    };
    var urlPOST = url + "/statements";
    console.log("insert executed");
    var re = this.http.post(urlPOST, body, httpOptions);
    console.log(re);
    return re;
  }

}
