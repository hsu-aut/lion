import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders }    from '@angular/common/http';

const url = `/eclassSearch/list`;



@Injectable({
  providedIn: 'root'
})
export class EclassSearchService {

  constructor( private http: HttpClient) { }

  getPropertyList(preferredName){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'none',
      })
    };

    var request = url + `?prop=${preferredName}`
    
    // return this.http.post(url, body, httpOptions).pipe(tap((data: any) => data.json()));  
    console.log("Query executed");
    console.log(request, httpOptions);
    var re = this.http.get(request, httpOptions);
    console.log(re);
    return re;
      
  }

  // start with ng serve --proxy-config proxy.conf.json --open
  

}
