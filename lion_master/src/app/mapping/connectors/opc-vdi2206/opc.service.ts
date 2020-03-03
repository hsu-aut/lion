import { Injectable } from '@angular/core';
import { QueriesService } from 'src/app/shared/services/backEnd/queries.service';
import { take } from 'rxjs/operators';
import { PrefixesService } from 'src/app/shared/services/prefixes.service';

@Injectable({
    providedIn: 'root'
})
export class OpcService {

    constructor(private queryService: QueriesService,
        private prefixService: PrefixesService) { }

    loadAllOpcUaServers() {
        const query = `PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        SELECT ?serverIri ?serverLabel WHERE {
            ?serverIri a OpcUa:UAServer;
            rdf:label ?serverLabel.
        }`;

        return this.queryService.SPARQL_SELECT_TABLE(query);
    }


    loadAllOpcUaNodes() {
        const query = `PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        SELECT ?nodeIri ?nodeLabel WHERE {
            ?nodeIri a OpcUa:UANode;
            rdf:label ?nodeLabel.
        }`;

        return this.queryService.SPARQL_SELECT_TABLE(query);
    };


    createOpcDin61360Connection(instanceDescription: string, opcVariable: string) {
        const query = `PREFIX lf: <http://lionFacts#>
                PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
                PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
                INSERT DATA {
                    DINEN61360:${instanceDescription} DINEN61360:hasOntologicalValue <${opcVariable}>.
            }`

        return this.queryService.SPARQL_UPDATE(query);
    }


    loadVariableAnd61360Connections() {
        const query = `PREFIX lf: <http://lionFacts#>
        PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
        SELECT ?instanceDescription ?opcVariable {
            ?instanceDescription DINEN61360:hasOntologicalValue ?opcVariable.
        }`;
        return this.queryService.SPARQL_SELECT_TABLE(query);
    }

}
