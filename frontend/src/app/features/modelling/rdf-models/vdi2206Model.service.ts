import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';

@Injectable({
    providedIn: 'root'
})
export class Vdi2206ModelService {

    private readonly baseUrl = "/lion_BE/vdi2206"

    constructor(
        private http: HttpClient,
    ) { }

    public getSystemsAndModules(): Observable<SparqlResponse> {
        const url = `${this.baseUrl}/systems-modules`;
        return this.http.get<SparqlResponse>(url);
    }

    public getSystems(): Observable<SparqlResponse> {
        const url = `${this.baseUrl}/systems`;
        return this.http.get<SparqlResponse>(url);
    }

    public getModules(): Observable<SparqlResponse> {
        const url = `${this.baseUrl}/modules`;
        return this.http.get<SparqlResponse>(url);
    }

    public getComponents(): Observable<SparqlResponse> {
        const url = `${this.baseUrl}/components`;
        return this.http.get<SparqlResponse>(url);
    }
}
