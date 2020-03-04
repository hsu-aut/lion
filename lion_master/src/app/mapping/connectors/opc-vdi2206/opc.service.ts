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
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?opcUaServer ?opcUaServerLabel WHERE {
            ?opcUaServer a OpcUa:UAServer;
            OPTIONAL {?opcUaServer rdfs:label ?opcUaServerLabel. }

        }`;

        return this.queryService.SPARQL_SELECT_TABLE(query);
    }


    loadAllOpcUaNodes() {
        const query = `PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        SELECT ?nodeIri ?nodeLabel WHERE {
            ?nodeIri a OpcUa:UANode;
            rdfs:label ?nodeLabel.
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
                        <${this.prefixService.parseToIRI(instanceDescription)}> DINEN61360:hasOntologicalValue <${opcVariable}>.
                    }
            }`;
        return this.queryService.SPARQL_UPDATE(query);
    }

    loadVariableAnd61360Connections() {
        const query = `
        PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        PREFIX DINEN61360: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?instanceDescription ?instanceDescriptionLabel ?opcVariable ?opcVariableLabel
        WHERE {
            ?instanceDescription rdf:type DINEN61360:Instance_Description;
	        DINEN61360:hasOntologicalValue ?opcVariable;
                OPTIONAL {?instanceDescription rdfs:label ?instanceDescriptionLabel;}
                OPTIONAL {?opcVariable rdfs:label ?opcVariableLabel.}
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
        return this.queryService.SPARQL_UPDATE(query);
    }


    loadServerAndVdi2206Connections() {
        const query = `PREFIX lf: <http://lionFacts#>
        PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
        SELECT ?systemOrModule ?systemOrModuleLabel ?opcUaServer ?opcUaServerLabel{
            {
                ?systemOrModule a VDI2206:System.
                ?systemOrModule OpcUa:hasOpcUaServer ?opcUaServer.
            }
            UNION
            {
                ?systemOrModule a VDI2206:Module.
                ?systemOrModule OpcUa:hasOpcUaServer ?opcUaServer.
            }
            OPTIONAL {?systemOrModule rdfs:label ?systemOrModuleLabel.}
            OPTIONAL {?opcUaServer rdfs:label ?opcUaServerLabel.}
        }`;
        return this.queryService.SPARQL_SELECT_TABLE(query);
    }

}
