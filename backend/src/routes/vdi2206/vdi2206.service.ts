import { Injectable } from '@nestjs/common';
import { SparqlService } from '../../shared-services/sparql.service';
import { GraphOperationService } from '../../shared-services/graph-operation.service';
import { SparqlResponse } from '../../models/sparql/SparqlResponse';
import { Observable, tap } from 'rxjs';

@Injectable()
export class Vdi2206Service {

	constructor(
		private queryService: SparqlService,
		private graphService: GraphOperationService
	) { }


	public selectAllSystems(): Observable<SparqlResponse> {
		const queryString	= 
			`PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
			PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

			SELECT ?system ?systemLabel ?consistsOfEntity ?EntityType WHERE {
				?system a VDI2206:System.
				OPTIONAL {
					?system rdfs:label ?systemLabel.
				}
				OPTIONAL {
					?system VDI2206:consistsOf ?consistsOfEntity.
					?consistsOfEntity rdf:type ?EntityType.
					VALUES ?EntityType {VDI2206:System VDI2206:Module VDI2206:Component}
				}
			}`;
		return this.queryService.query(queryString);
	} 


	public selectAllModules(): Observable<SparqlResponse> {
		const queryString = 
			`PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
			PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
			
			SELECT ?module ?consistsOfEntity ?EntityType WHERE {
				?module a VDI2206:Module.
				OPTIONAL {
					?module VDI2206:consistsOf ?consistsOfEntity.
					?consistsOfEntity rdf:type ?EntityType.
					VALUES ?EntityType {VDI2206:Module VDI2206:Component}
				}
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
					
			SELECT ?component WHERE {
				?component a VDI2206:Component.
			}`;

		return this.queryService.query(queryString);
	}


	// /**
	//  * Selects all systems and the sub-systems, modules, and components that they consist of
	//  * @returns 
	//  */
	// public selectSystemsAndConstituents(): Observable<SparqlResponse>  {
	// 	const queryString = 
	// 		`PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
	// 		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

	// 		SELECT ?System ?systemLabel ?consistsOfEntity ?EntityType WHERE {
	// 			?System a VDI2206:System.
	// 			OPTIONAL {
	// 				?system rdfs:label ?systemLabel.
	// 				?System VDI2206:consistsOf ?consistsOfEntity.
	// 				?consistsOfEntity rdf:type ?EntityType.
	// 				VALUES ?EntityType {VDI2206:System VDI2206:Module VDI2206:Component}
	// 			}
	// 		}`;

	// 	return this.queryService.query(queryString);
	// } 
	
	
	// public selectModulesAndConstituents(): Observable<SparqlResponse> {
	// 	const queryString = `
	// 		PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
	// 		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
			
	// 		SELECT ?Module ?consistsOfEntity ?EntityType WHERE {
	// 			?Module a VDI2206:Module.
	// 			OPTIONAL {
	// 				?Module VDI2206:consistsOf ?consistsOfEntity.
	// 				?consistsOfEntity rdf:type ?EntityType.
	// 				VALUES ?EntityType {VDI2206:Module VDI2206:Component}
	// 			}
	// 		}`;

	// 	return this.queryService.query(queryString);
	// } 
	

	// public selectSystemInheritanceInformation() {
	// 	const queryString = `
	// 		PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
	// 		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
			
	// 		SELECT ?System ?childEntity ?childEntityType WHERE {
	// 			?System a VDI2206:System.
	// 			OPTIONAL {
	// 				?System VDI2206:hasChild ?childEntity.
	// 				?childEntity rdf:type ?childEntityType.
	// 				VALUES ?childEntityType {VDI2206:System VDI2206:Module VDI2206:Component}
	// 			}
	// 		}`;
	// 	return this.queryService.query(queryString);
	// } 

	// public selectModuleInheritanceInformation() {
	// 	const queryString = 
	// 		`PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
	// 		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		
	// 		SELECT ?Module ?childEntity ?childEntityType WHERE {
	// 			?Module a VDI2206:Module.
	// 			OPTIONAL {
	// 				?Module VDI2206:hasChild ?childEntity.
	// 				?childEntity rdf:type ?childEntityType.
	// 				VALUES ?childEntityType {VDI2206:Module VDI2206:Component}
	// 			}
	// 		}`;
	// 	return this.queryService.query(queryString);
	// } 

	// public selectComponentInheritanceInformation() {
	// 	const queryString = 
	// 		`PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
	// 		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
			
	// 		SELECT ?Component ?childEntity ?childEntityType WHERE {
	// 		?Component a VDI2206:Component.
	// 			OPTIONAL {
	// 				?Component VDI2206:hasChild ?childEntity.
	// 				?childEntity rdf:type ?childEntityType.
	// 				VALUES ?childEntityType {VDI2206:Component}
	// 			}
	// 		}`;
	// 	return this.queryService.query(queryString);}
	
}