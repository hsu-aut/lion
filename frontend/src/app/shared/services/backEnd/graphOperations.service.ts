import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { take } from 'rxjs/operators';

import { Tables } from '../../../features/modelling/utils/tables';
import { ConfigurationService } from './configuration.service';
import { FormatDescription } from '../../../features/modelling/utils/formats';
import { QueriesService } from './queries.service';
import { DownloadService } from './download.service';
import { MessagesService } from "../messages.service";

/* This service is relevant for graph related interactions with the backend, e.g. get all triples, set all triples or delete a graph */

@Injectable({
    providedIn: 'root'
})
export class GraphOperationsService {

    // util
    TableUtil = new Tables();
    defaultGraph = new DefaultGraph();

    GRAPHS = this.defaultGraph.GRAPHS;
    activeGraph = this.defaultGraph.activeGraph;

    constructor(
        private http: HttpClient,
        private config: ConfigurationService,
        private query: QueriesService,
        private dlService: DownloadService,
        private messageService: MessagesService
    ) {
        // initially set all named graphs from graphdb
        this.setNamedGraphs();
    }

    private getGraphURL() {
        return this.config.getHost() + '/graphs';
    }

    public getGraphs() {
        return this.GRAPHS;
    }

    public addGraph(identifier: string) {

        const name = identifier;
        this.GRAPHS.push(name);
        this.messageService.addMessage('success', 'Alright', `The named graph ` + name + ' has been added.');
    }

    public editGraph(key, identifier) {
        this.GRAPHS[key] = identifier;
    }

    public deleteGraph(key) {
        this.GRAPHS.splice(key, 1);
    }

    public getActiveGraph() {
        return this.activeGraph;
    }

    public setActiveGraph(key) {
        const max = this.GRAPHS.length;

        if (key <= max) {
            this.activeGraph = key;
        }
        this.messageService.addMessage('success', 'Alright', `The new named graph is ` + this.GRAPHS[this.activeGraph]);
    }

    /* GRAPH OPERATIONS */

    setNamedGraphs() {
        const defaultGraph = new DefaultGraph();
        this.GRAPHS = defaultGraph.GRAPHS;
        const selectString = `
        SELECT DISTINCT ?g
        WHERE {
        GRAPH ?g { ?s ?p ?o }
        }`;
        this.query.SPARQL_SELECT_LIST(selectString, 0).subscribe((data: any) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].startsWith('http')) {
                    this.GRAPHS.push(data[i]);
                }
            }
        });
    }

    getTriplesOfNamedGraph(graph: string, format: FormatDescription) {

        const headers = new HttpHeaders().set('Accept', format.MIME_type);
        const params = new HttpParams().set('graph', encodeURIComponent(graph)).set('repositoryName', this.config.getRepository());

        this.http.get(this.getGraphURL(), { headers, params }).pipe(take(1)).subscribe((data: string) => {
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
        (error) => {
            // as the Angular http client tries to parse the return as json, the error text has to be accessed. Using a returnType confuses the GraphDB...
            const blob = new Blob([error.error.text], { type: 'text' });
            // Dateiname
            const name = graph + format.fileEnding;
            // Downloadservice
            this.dlService.download(blob, name);
        });
    }



    deleteTriplesOfNamedGraph(graph: string) {
        // that is actually a put, accept should fit to type contained in the body that will be accepted by the db
        const headers = new HttpHeaders().set('Accept', 'text/turtle').set('Content-Type', 'text/plain');
        const params = new HttpParams().set('graph', encodeURIComponent(graph)).set('repositoryName', this.config.getRepository());

        // an empty body will clear the graph, a non empty body will insert triples that are in the body whatch for the mime type
        const body = "";

        const re = this.http.put(this.getGraphURL(), body, { headers, params });
        return re;
    }


    deleteNamedGraph(graph: string) {

        const params = new HttpParams().set('graph', encodeURIComponent(graph)).set('repositoryName', this.config.getRepository());

        const re = this.http.delete(this.getGraphURL(), { params });
        return re;
    }

}

class DefaultGraph {

    public GRAPHS: Array<string> = ["http://lionFacts"]
    public activeGraph: number = this.GRAPHS.length - 1;

}
