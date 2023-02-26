import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { GraphUpdate } from '@shared/models/graphs/GraphUpdate';
import { Tables } from '../../../features/modelling/utils/tables';
import { ConfigurationService } from './configuration.service';
import { FormatDescription } from '../../../features/modelling/utils/formats';
import { DownloadService } from './download.service';
import { Observable } from 'rxjs';
import { GraphDto } from '@shared/models/graphs/GraphDto';

/* This service is relevant for graph related interactions with the backend, e.g. get all triples, set all triples or delete a graph */

@Injectable({
    providedIn: 'root'
})
export class GraphOperationsService {

    // util
    TableUtil = new Tables();
    defaultGraph = "http://lionFacts";
    activeGraph = this.defaultGraph;

    constructor(
        private http: HttpClient,
        private config: ConfigurationService,
        private dlService: DownloadService,
    ) {}

    private getGraphBaseUrl() {
        return this.config.getHost() + '/graphs';
    }

    public getAllGraphsOfWorkingRepository(): Observable<GraphDto[]> {
        const url = this.getGraphBaseUrl();
        return this.http.get<GraphDto[]>(url);
    }

    public getActiveGraph(): Observable<GraphDto> {
        const url = this.getGraphBaseUrl();
        const queryParam = {
            type: "current"
        };
        return this.http.get<GraphDto>(url, {params: queryParam});
    }

    public setActiveGraph(graphIri: string): Observable<GraphDto> {
        const url = this.getGraphBaseUrl();
        const graphData = {
            graphIri: graphIri
        };
        const queryParam = {
            type: "current"
        };
        return this.http.put<GraphDto>(url, graphData, {params: queryParam});
    }

    public addGraph(newGraphIri: string): Observable<void> {
        const url = this.getGraphBaseUrl();
        const newGraphRequest = new GraphUpdate(newGraphIri);
        return this.http.post<void>(url, newGraphRequest);
    }


    getTriplesOfNamedGraph(graph: string, format: FormatDescription): void {
        const headers = new HttpHeaders().set('Accept', format.MIME_type);
        const url = `${this.getGraphBaseUrl()}/${encodeURIComponent(graph)}/triples`;
        this.http.get(url, { headers }).pipe(take(1)).subscribe({
            next: (data: string) => {
                if (format.fileEnding == '.json') {
                    data = JSON.stringify(data);
                }
                // data = JSON.stringify(data)
                // console.log(data)
                const blob = new Blob([data], { type: 'text' });
                // Dateiname
                const name = graph + format.fileEnding;
                // Downloadservice
                this.dlService.download(blob, name);
            },
            error: (error) => {
            // as the Angular http client tries to parse the return as json, the error text has to be accessed. Using a returnType confuses the GraphDB...
                const blob = new Blob([error.error.text], { type: 'text' });
                // Dateiname
                const name = graph + format.fileEnding;
                // Downloadservice
                this.dlService.download(blob, name);
            }
        });
    }

    public deleteNamedGraph(graphIri: string): Observable<void> {
        const encodedIri = encodeURIComponent(graphIri);
        const url = `${this.getGraphBaseUrl()}/${encodedIri}`;
        return this.http.delete<void>(url);
    }

    public deleteTriplesOfNamedGraph(graphIri: string): Observable<void> {
        const encodedIri = encodeURIComponent(graphIri);
        const url = `${this.getGraphBaseUrl()}/${encodedIri}/triples`;
        return this.http.delete<void>(url);
    }

}
