import { Injectable } from '@angular/core';
import { QueriesService } from '@shared-services/backEnd/queries.service';
import { PrefixesService } from '@shared-services/prefixes.service';
import { GraphOperationsService } from '@shared-services/backEnd/graphOperations.service';
import { toSparqlTable } from '../../../modelling/utils/rxjs-custom-operators';

@Injectable({
    providedIn: 'root'
})
export class OpcService {

    constructor(private queryService: QueriesService,
        private graphService: GraphOperationsService,
        private prefixService: PrefixesService) { }

    loadAllOpcUaServers() {
        const query = `PREFIX OpcUa: <http://www.w3id.org/hsu-aut/OpcUa#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?opcUaServer ?opcUaServerLabel WHERE {
            ?opcUaServer a OpcUa:UAServer;
            OPTIONAL {?opcUaServer rdfs:label ?opcUaServerLabel. }

        }`;

        return this.queryService.executeSelect(query).pipe(toSparqlTable());
    }


    loadAllOpcUaNodes() {
        const query = `PREFIX OpcUa: <http://www.w3id.org/hsu-aut/OpcUa#>
        SELECT ?nodeIri ?nodeLabel WHERE {
            ?nodeIri a OpcUa:UANode;
            rdfs:label ?nodeLabel.
        }`;

        return this.queryService.executeSelect(query).pipe(toSparqlTable());
    }


    createOpcDin61360Connection(instanceDescription: string, opcVariable: string) {
        // TODO: This was commented out as there is a lot wrong here.
        // 1: activeGraph should not be handled here
        // 2: The whole query should be moved to the backend

        // const graphs = this.graphService.getAllGraphsOfWorkingRepository();
        // const graphIndex = this.graphService.getActiveGraph();
        // const activeGraph = graphs[graphIndex];
        // const query = `PREFIX lf: <http://lionFacts#>
        //         PREFIX OpcUa: <http://www.w3id.org/hsu-aut/OpcUa#>
        //         PREFIX DINEN61360: <http://www.w3id.org/hsu-aut/DINEN61360#>
        //         INSERT DATA {
        //             GRAPH <${activeGraph}> {
        //                 <${this.prefixService.parseToIRI(instanceDescription)}> DINEN61360:hasOntologicalValue <${opcVariable}>.
        //             }
        //     }`;
        // return this.queryService.executeUpdate(query);
    }

    loadVariableAnd61360Connections() {
        const query = `
        PREFIX OpcUa: <http://www.w3id.org/hsu-aut/OpcUa#>
        PREFIX DINEN61360: <http://www.w3id.org/hsu-aut/DINEN61360#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?instanceDescription ?instanceDescriptionLabel ?opcVariable ?opcVariableLabel
        WHERE {
            ?instanceDescription rdf:type DINEN61360:Instance_Description;
	        DINEN61360:hasOntologicalValue ?opcVariable;
                OPTIONAL {?instanceDescription rdfs:label ?instanceDescriptionLabel;}
                OPTIONAL {?opcVariable rdfs:label ?opcVariableLabel.}
            }`;
        return this.queryService.executeSelect(query).pipe(toSparqlTable());
    }


    createOpcVdi2206Connection(systemOrModule: string, opcUaServer: string) {
        // TODO: This was commented out as there is a lot wrong here.
        // 1: activeGraph should not be handled here
        // 2: The whole query should be moved to the backend

        // const graphs = this.graphService.getAllGraphsOfWorkingRepository();
        // const graphIndex = this.graphService.getActiveGraph();
        // const activeGraph = graphs[graphIndex];
        // const query = `PREFIX lf: <http://lionFacts#>
        // PREFIX OpcUa: <http://www.w3id.org/hsu-aut/OpcUa#>
        // PREFIX VDI2206: <http://www.w3id.org/hsu-aut/VDI2206#>
        // INSERT DATA {
        //     GRAPH <${activeGraph}> {
        //         <${this.prefixService.parseToIRI(systemOrModule)}> OpcUa:hasOpcUaServer <${opcUaServer}>.
        //     }
        // }`;
        // return this.queryService.executeUpdate(query);
    }


    loadServerAndVdi2206Connections() {
        const query = `PREFIX lf: <http://lionFacts#>
        PREFIX OpcUa: <http://www.w3id.org/hsu-aut/OpcUa#>
        PREFIX VDI2206: <http://www.w3id.org/hsu-aut/VDI2206#>
        SELECT DISTINCT ?systemOrModuleLabel ?opcUaServer ?opcUaServerLabel{
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
        return this.queryService.executeSelect(query).pipe(toSparqlTable());
    }

}
