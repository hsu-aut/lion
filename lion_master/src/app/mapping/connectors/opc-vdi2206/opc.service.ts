import { Injectable } from '@angular/core';
import { QueriesService } from 'src/app/shared/services/backEnd/queries.service';
import { take } from 'rxjs/operators';
import { PrefixesService } from 'src/app/shared/services/prefixes.service';
import { GraphOperationsService } from 'src/app/shared/services/backEnd/graphOperations.service';

@Injectable({
    providedIn: 'root'
})
export class OpcService {

    constructor(private queryService: QueriesService,
        private graphService: GraphOperationsService,
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
        const graphs = this.graphService.getGraphs();
        const graphIndex = this.graphService.getActiveGraph();
        const activeGraph = graphs[graphIndex];
        const query = `PREFIX lf: <http://lionFacts#>
                PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
                PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
                INSERT DATA {
                    GRAPH <${activeGraph}> {
                        ${this.prefixService.parseToIRI(instanceDescription)} DINEN61360:hasOntologicalValue <${opcVariable}>.
                    }
            }`;

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


    createOpcVdi2206Connection(systemOrModule: string, opcUaServer: string) {
        const graphs = this.graphService.getGraphs();
        const graphIndex = this.graphService.getActiveGraph();
        const activeGraph = graphs[graphIndex];
        const query = `PREFIX lf: <http://lionFacts#>
        PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
        INSERT DATA {
            GRAPH <${activeGraph}> {
                <${this.prefixService.parseToIRI(systemOrModule)}> OpcUa:hasOpcUaServer <${opcUaServer}>.
            }
        }`

        console.log(query);

        return this.queryService.SPARQL_UPDATE(query);
    }


    loadServerAndVdi2206Connections() {
        const query = `PREFIX lf: <http://lionFacts#>
        PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
        SELECT ?system ?module ?opcUaServer {
            {
                ?system a VDI2206:System.
                ?system OpcUa:hasOpcUaServer ?opcUaServer.
            }
            UNION
            {
                ?module a VDI2206:Module.
                ?module OpcUa:hasOpcUaServer ?opcUaServer.
            }
        }`;
        return this.queryService.SPARQL_SELECT_TABLE(query);
    }

}
