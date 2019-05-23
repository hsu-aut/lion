import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders }    from '@angular/common/http';

//const url = `/eclassSearch/list`;



@Injectable({
  providedIn: 'root'
})
export class EclassSearchService {
  url: string;
  constructor( private http: HttpClient) {
    this.url = `/lion_BE`;
   }

  getPropertyList(preferredName){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'none',
      })
    };

    var request = this.url + `eclassSearch/list?prop=${preferredName}`
    
    // return this.http.post(url, body, httpOptions).pipe(tap((data: any) => data.json()));  
    console.log("Query executed");
    console.log(request, httpOptions);
    var re = this.http.get(request, httpOptions);
    console.log(re);
    return re;
      
  }

  getEclassUrl(){
    return this.url;
  }

  setEclassUrl(url: string){
    this.url = url;
  }

  // getTBox(){
  //   var httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type':  'none',
  //     })
  //   };

  //   var request = this.url + `/TBox/vdi3682`;
    
  //   // return this.http.post(url, body, httpOptions).pipe(tap((data: any) => data.json()));  
  //   console.log("Query executed");
  //   console.log(request, httpOptions);
  //   var re = this.http.get(request, httpOptions);
  //   console.log(re);
  //   return re;
      
  // }
  

}
