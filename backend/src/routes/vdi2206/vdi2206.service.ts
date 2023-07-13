import { Injectable } from '@nestjs/common';
import { SparqlService } from '../../shared-services/sparql.service';
import { GraphOperationService } from '../../shared-services/graph-operation.service';
import { SparqlResponse } from '../../models/sparql/SparqlResponse';
import { Observable } from 'rxjs';

@Injectable()
export class Vdi2206Service {

	constructor(
		private queryService: SparqlService,
		private graphService: GraphOperationService
	) { }


	public selectAllSystems(): Observable<SparqlResponse> {
		const queryString	= `
			PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
			PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
			
			SELECT ?System WHERE {
				?System a VDI2206:System.
			}`;
		return this.queryService.query(queryString);
	} 


	public selectAllModules(): Observable<SparqlResponse> {
		const queryString = 
			`PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
			PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
			
			SELECT ?Module WHERE {
				?Module a VDI2206:Module.
			}`;
		
		return this.queryService.query(queryString);
	} 

	public selectAllSystemsAndModules(): Observable<SparqlResponse> {
		const queryString = 
			`PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
			PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
			PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
			
			SELECT ?systemOrModule ?systemOrModuleLabel WHERE {
				{ ?systemOrModule a VDI2206:System. }
				UNION
				{ ?systemOrModule a VDI2206:Module. }
			OPTIONAL {
				?systemOrModule rdfs:label ?systemOrModuleLabel.
			}
			}`;
		
		return this.queryService.query(queryString);
	} 
	
	public selectAllComponents(): Observable<SparqlResponse> {
		const queryString = 
			`PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
			PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
			
			SELECT ?Component WHERE {
				?Component a VDI2206:Component.
			}`;

		return this.queryService.query(queryString);
	}


	/**
	 * Selects all systems and the sub-systems, modules, and components that they consist of
	 * @returns 
	 */
	public selectSystemsAndConstituents(): Observable<SparqlResponse>  {
		const queryString = 
		`PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

		SELECT ?System ?systemLabel ?consistsOfEntity ?EntityType WHERE {
			?System a VDI2206:System.
			OPTIONAL {
				?system rdfs:label ?systemLabel.
				?System VDI2206:consistsOf ?consistsOfEntity.
				?consistsOfEntity rdf:type ?EntityType.
				VALUES ?EntityType {VDI2206:System VDI2206:Module VDI2206:Component}
			}
		}`;

		return this.queryService.query(queryString);
	} 
	
	
	public selectModulesAndConstituents(): Observable<SparqlResponse> {
		const queryString = `
		PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		
		SELECT ?Module ?consistsOfEntity ?EntityType WHERE {
			?Module a VDI2206:Module.
			OPTIONAL {
				?Module VDI2206:consistsOf ?consistsOfEntity.
				?consistsOfEntity rdf:type ?EntityType.
				VALUES ?EntityType {VDI2206:Module VDI2206:Component}
			}
		}`;

		return this.queryService.query(queryString);
	} 
	
	// TODO: Check if these functions are really needed...

	// 	public SPARQL_SELECT_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS = `
	// PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
	// PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	
	// SELECT ?System ?childEntity ?childEntityType WHERE {
	// ?System a VDI2206:System.
	//   OPTIONAL {?System VDI2206:hasChild ?childEntity.
	// 	?childEntity rdf:type ?childEntityType.
	// 	VALUES ?childEntityType {VDI2206:System VDI2206:Module VDI2206:Component}
	// }
	// }
	// `
	// 	public SPARQL_SELECT_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD = `
	// PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
	// PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	
	// SELECT ?Module ?childEntity ?childEntityType WHERE {
	// ?Module a VDI2206:Module.
	//   OPTIONAL {?Module VDI2206:hasChild ?childEntity.
	// 	?childEntity rdf:type ?childEntityType.
	// 	VALUES ?childEntityType {VDI2206:Module VDI2206:Component}}
	// }
	// `
	// 	public SPARQL_SELECT_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM = `
	// PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
	// PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	
	// SELECT ?Component ?childEntity ?childEntityType WHERE {
	// ?Component a VDI2206:Component.
	//   OPTIONAL {?Component VDI2206:hasChild ?childEntity.
	// 	?childEntity rdf:type ?childEntityType.
	// 	VALUES ?childEntityType {VDI2206:Component}}
	// }
	`
	
}