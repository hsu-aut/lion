import { Component, OnInit } from '@angular/core';

import { QueriesService } from '@shared-services/backEnd/queries.service';
import { take } from 'rxjs/operators';

import { PrefixesService } from '@shared-services/prefixes.service';

@Component({
    selector: 'app-query-editor',
    templateUrl: './query-editor.component.html',
    styleUrls: ['./query-editor.component.scss']
})
export class QueryEditorComponent implements OnInit {


    userQuery =
        `select * where {
    ?s ?p ?o .
  }limit 100`;
    queryResult: Array<Record<string, any>> = [];

    // table var
    tableTitle: string;
    tableSubTitle: string;
    filterOption = true;

    constructor(
        private query: QueriesService,
        private namespaceService: PrefixesService
    ) { }

    ngOnInit() {
    }

    executeQuery(query: string) {
        this.tableTitle = "Query results";
        this.tableSubTitle = "The results to your query are shown below. Click on a cell to query for related triples.";
        this.query.SPARQL_SELECT_TABLE(query).pipe(take(1)).subscribe((data: any) => {
            // console.log(data)
            this.queryResult = data;
        });
    }

    tableClick(individual) {
        const PREFIXES = this.namespaceService.getPrefixes();

        // if known prefix contained in individual, get related triples
        for (let i = 0; i < PREFIXES.length; i++) {
            if (individual.search(PREFIXES[i].prefix) != -1) {
                this.query.getRelatedTriples(individual).pipe(take(1)).subscribe((data: any) => {
                    this.queryResult = data;
                    this.tableTitle = "Triples related to: " + '"' + individual + '"';
                    this.tableSubTitle = "Click on a cell to load triples related to this element.";
                });
            }
        }
        // if http: or urn: is contained in individial, get related triples
        if (individual.search("http:") != -1 || individual.search("urn:") != -1) {
            this.query.getRelatedTriples(individual).pipe(take(1)).subscribe((data: any) => {
                this.queryResult = data;
                this.tableTitle = "Triples related to: " + '"' + individual + '"';
                this.tableSubTitle = "Click on a cell to load triples related to this element.";
            });
        }

    }

}
