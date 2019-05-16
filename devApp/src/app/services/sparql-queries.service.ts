import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders }    from '@angular/common/http';



//const url = `http://localhost:7200/repositories/Airbus_CTC_01`;



@Injectable({
  providedIn: 'root'
})
export class SparqlQueriesService {
    url: string;



  constructor(private http: HttpClient) {
    // new Hamied -> default url in constructor
    this.url = 'http://localhost:7200/repositories/testdb';

  }

  select(body){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/sparql-query'
      })
    };
    
    // return this.http.post(url, body, httpOptions).pipe(tap((data: any) => data.json()));  
    console.log("Query executed");
    console.log(this.url, body, httpOptions);
    var re = this.http.post(this.url, body, httpOptions);
    console.log(re);
    return re;
      
  }

  insert(body){

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/sparql-update'
      })
    };
    var urlPOST = this.url + "/statements";
    console.log("insert executed");
    var re = this.http.post(urlPOST, body, httpOptions);
    console.log(re);
    return re;
  }

  // New Hamied -> Getter and Setter
  getUrl(){
    return this.url;
  }
  setUrl(url: string){
    this.url = url;
  }


}


