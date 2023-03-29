import { Injectable } from '@angular/core';

import { PrefixesService } from '@shared-services/prefixes.service';
import { QueriesService } from '@shared-services/backEnd/queries.service';
import { GraphOperationsService } from '@shared-services/backEnd/graphOperations.service';
import { DownloadService } from '@shared-services/backEnd/download.service';
import { DataLoaderService } from '@shared-services/dataLoader.service';
import { MessagesService } from '@shared-services/messages.service';
import { switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FpbStepService {

    private data = new Data();
    private insert = new Insert();

    private TABLE_OF_SYSTEM_INFO = [];
    private TABLE_OF_TECHNICAL_RESOURCE_INFO = [];
    private TABLE_OVERVIEW = [];

    constructor(
        private query: QueriesService,
        private downloadService: DownloadService,
        private nameService: PrefixesService,
        private loadingScreenService: DataLoaderService,
        private messageService: MessagesService,
        private graphs: GraphOperationsService,
    ) {
        this.initializeService();
    }

    public initializeService() {
        this.loadTABLE_OF_TECHNICAL_RESOURCE_INFO().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.TABLE_OF_TECHNICAL_RESOURCE_INFO = data;
        });
        this.loadTABLE_OF_SYSTEM_INFO().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.TABLE_OF_SYSTEM_INFO = data;
        });
        this.loadTABLE_OVERVIEW().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.TABLE_OVERVIEW = data;
        });
    }

    public loadTABLE_OF_TECHNICAL_RESOURCE_INFO() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.data.SELECT_TABLE_OF_TECHNICAL_RESOURCE_INFO);
    }

    public loadTABLE_OF_SYSTEM_INFO() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.data.SELECT_TABLE_OF_SYSTEM_INFO);
    }
    public loadTABLE_OVERVIEW() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.data.SELECT_TABLE_OVERVIEW);
    }

    public setTABLE_OVERVIEW(table) {
        this.TABLE_OVERVIEW = table;
    }


    public getTABLE_OF_TECHNICAL_RESOURCE_INFO() {
        return this.TABLE_OF_TECHNICAL_RESOURCE_INFO;
    }

    public getTABLE_OF_SYSTEM_INFO() {
        return this.TABLE_OF_SYSTEM_INFO;
    }

    public getTABLE_OVERVIEW() {
        return this.TABLE_OVERVIEW;
    }

    public modifyTripel(variables, action: string) {

        return this.graphs.getActiveGraph().pipe(switchMap(activeGraph => {
            switch (action) {
            case "add": {
                return this.query.executeUpdate(this.insert.createEntity(variables, activeGraph));
            }
            case "delete": {
                this.messageService.warn('Sorry!', 'This feature has not been implemented yet');
                break;
            }
            case "build": {
                const blobObserver = new Observable((observer) => {
                    const insertString = this.insert.createEntity(variables, activeGraph);
                    const blob = new Blob([insertString], { type: 'text/plain' });
                    const name = 'insert.txt';
                    this.downloadService.download(blob, name);
                    observer.next();
                    observer.complete();
                });
                return blobObserver;
            }
            }
        }));
    }

}

export class Data {

    public SELECT_TABLE_OF_TECHNICAL_RESOURCE_INFO = `
  PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

  SELECT ?ID ?longName ?shortName
  FROM <http://www.ontotext.com/explicit>
  WHERE {
  ?ID a VDI3682:TechnicalResource.
    OPTIONAL {?ID VDI3682:shortName ?shortName.}
    OPTIONAL {?ID VDI3682:longName ?longName.}
  }
  `

    public SELECT_TABLE_OF_SYSTEM_INFO = `
  PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

  SELECT ?ID ?label
  FROM <http://www.ontotext.com/explicit>
  WHERE {
  ?ID a VDI2206:System.
    OPTIONAL {?ID rdfs:label ?label.}
  }
  `

    public SELECT_TABLE_OVERVIEW = `
  PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>

  SELECT DISTINCT ?CADLabel ?longName ?shortName WHERE {
  ?technicalResource a VDI2206:System.
  ?technicalResource a VDI3682:TechnicalResource.
  ?technicalResource rdfs:label ?CADLabel.
  ?technicalResource VDI3682:longName ?longName.
  ?technicalResource VDI3682:shortName ?shortName.
  }
  `

}

export class Insert {

    createEntity(variables, activeGraph) {
        const subject = variables.subject;
        const object = variables.object;

        const insertString = `
      INSERT {
        GRAPH <${activeGraph}>{
            ?subject owl:sameAs ?object.
          }
      } WHERE {
          BIND(IRI(STR("${subject}")) AS ?subject).
          BIND(IRI(STR("${object}")) AS ?object).
      }`;
        console.log(insertString);
        return insertString;

    }

}
