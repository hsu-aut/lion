import { Injectable } from '@angular/core';
import { QueriesService } from 'src/app/shared/services/backEnd/queries.service';

@Injectable({
    providedIn: 'root'
})
export class OpcService {

    constructor(private queryService: QueriesService) { }

    loadAllOpcUaServers() {
        const query = `PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        SELECT ?serverIri ?serverLabel WHERE {
            ?serverIri a OpcUa:UAServer;
            rdf:label ?serverLabel.
        }`;

        return this.queryService.SPARQL_SELECT_TABLE(query);
    }


}
