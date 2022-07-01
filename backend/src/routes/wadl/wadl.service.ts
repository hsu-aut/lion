import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SparqlService } from '../../shared-services/sparql.service';
import { BaseResourceDefinition } from '@shared/models/odps/wadl/BaseResourceDefinition';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { ServiceDefinition } from '@shared/models/odps/wadl/ServiceDefinition';
import { GraphOperationService } from '../../shared-services/graph-operation.service';

@Injectable()
export class WadlService {

	constructor(
		private queryService: SparqlService,
		private graphService: GraphOperationService
	) { }

	/**
	 * Get all base resources
	 * @returns All currently existing base resources with their basePath and the entitiy providing the resource
	 */
	getBaseResources(): Observable<SparqlResponse> {
		const queryString = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		SELECT ?baseResource ?basePath ?serviceProvider WHERE {
			?baseResource rdf:type wadl:Resources;
				a owl:NamedIndividual;
				wadl:hasBase ?basePath;
				wadl:RestResourcesAreProvidedByEntity ?serviceProvider.
		}`;

		return this.queryService.query(queryString);
	}

	addBaseResource(baseResource: BaseResourceDefinition): Observable<void> {
		const activeGraph = this.graphService.getCurrentGraph();
		const updateString = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        INSERT DATA {
            GRAPH <${activeGraph}> {
				<${baseResource.baseResourceIri}> rdf:type wadl:Resources;
				a owl:NamedIndividual;
				wadl:hasBase "${baseResource.baseResourcePath}"^^xsd:anyURI;
				wadl:RestResourcesAreProvidedByEntity <${baseResource.serviceProviderIri}>.
			}
        }`;
		return this.queryService.update(updateString);
	}


	// TODO: This query can pretty surely be simplified - do it :D
	deleteBaseResource(baseResourceIri: string): Observable<void> {
		const deleteString = `
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		PREFIX owl: <http://www.w3.org/2002/07/owl#>
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		DELETE {
			?bodyRepresentationParameterOption ?predicate ?object.
		} WHERE {

			<${baseResourceIri}> wadl:hasResource ?service.
			?service wadl:hasMethod ?method.
			?method wadl:hasRequest ?request.
			?request wadl:hasRepresentation ?bodyRepresentation.
			?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.
			?bodyRepresentationParameter wadl:hasParameterOption ?bodyRepresentationParameterOption.

			?bodyRepresentationParameterOption ?predicate ?object.
		};
		DELETE {
			?bodyRepresentationParameter ?predicate ?object.
		} WHERE {

			<${baseResourceIri}> wadl:hasResource ?service.
			?service wadl:hasMethod ?method.
			?method wadl:hasRequest ?request.
			?request wadl:hasRepresentation ?bodyRepresentation.
			?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.

			?bodyRepresentationParameter ?predicate ?object.
		};
		DELETE {

		?bodyRepresentation ?predicate ?object.

		} WHERE {

			<${baseResourceIri}> wadl:hasResource ?service.
			?service wadl:hasMethod ?method.
			?method wadl:hasRequest ?request.
			?request wadl:hasRepresentation ?bodyRepresentation.

			?bodyRepresentation ?predicate ?object.
		};
		DELETE {

			?option ?predicate ?object.

		} WHERE {

			<${baseResourceIri}> wadl:hasResource ?service.
			?service wadl:hasMethod ?method.
			?method wadl:hasRequest ?request.
			?request wadl:hasParameter ?parameter.
			?parameter wadl:hasParameterOption ?option.

			?option ?predicate ?object.
			};
    DELETE {

        ?parameter ?predicate ?object.

      } WHERE {

          <${baseResourceIri}> wadl:hasResource ?service.
          ?service wadl:hasMethod ?method.
          ?method wadl:hasRequest ?request.
          ?request wadl:hasParameter ?parameter.

          ?parameter ?predicate ?object.
        };
    DELETE {

      ?request ?predicate ?object.

      } WHERE {

        <${baseResourceIri}> wadl:hasResource ?service.
        ?service wadl:hasMethod ?method.
        ?method wadl:hasRequest ?request.

        ?request ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentationParameterOption ?predicate ?object.

      } WHERE {

        <${baseResourceIri}> wadl:hasResource ?service.
        ?service wadl:hasMethod ?method.
        ?method wadl:hasResponse ?response.
        ?response wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.
        ?bodyRepresentationParameter wadl:hasParameterOption ?bodyRepresentationParameterOption.

        ?bodyRepresentationParameterOption ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentationParameter ?predicate ?object.

      } WHERE {

        <${baseResourceIri}> wadl:hasResource ?service.
        ?service wadl:hasMethod ?method.
        ?method wadl:hasResponse ?response.
        ?response wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.

        ?bodyRepresentationParameter ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentation ?predicate ?object.

      } WHERE {

        <${baseResourceIri}> wadl:hasResource ?service.
        ?service wadl:hasMethod ?method.
        ?method wadl:hasResponse ?response.
        ?response wadl:hasRepresentation ?bodyRepresentation.

        ?bodyRepresentation ?predicate ?object.
      };

    DELETE {

    ?response ?predicate ?object.

    } WHERE {

      <${baseResourceIri}> wadl:hasResource ?service.
      ?service wadl:hasMethod ?method.
      ?method wadl:hasResponse ?response.

      ?response ?predicate ?object.
    };
    DELETE {

      ?method ?predicate ?object.

    } WHERE {

      <${baseResourceIri}> wadl:hasResource ?service.
      ?service wadl:hasMethod ?method.

      ?method ?predicate ?object.
    };

    DELETE {

      ?service ?predicate ?object.

    } WHERE {

      <${baseResourceIri}> wadl:hasResource ?service.

      ?service ?predicate ?object.
    };
    DELETE WHERE {
      <${baseResourceIri}> ?predicate ?object.
    }
    `;
		return this.queryService.update(deleteString);
	}


	/**
	 * Get all services as a SparqlResponse object. If a base resource IRI is passed, this IRI is taken as a filter criterium to return only services of this base
	 * @returns All currently existing services with their base resource, base path and service path
	 */
	getServices(baseResource = ""): Observable<SparqlResponse> {
		let filterString = "";
		if (baseResource) { filterString = `FILTER (?baseIri == ${baseResource});`; }

		const queryString = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		SELECT ?baseResource ?service ?basePath ?servicePath WHERE {
			?baseResource wadl:hasResource ?service;
				wadl:hasBase ?basePath.

			?service rdf:type wadl:Resource;
				a owl:NamedIndividual;
				wadl:hasPath ?servicePath.
			${filterString}
		}`;
		return this.queryService.query(queryString);
	}

	/**
	 * Inserts a new service into the current graph
	 * @param serviceDefinition A service definition object containing info about the service to insert
	 * @returns 
	 */
	addService(serviceDefinition: ServiceDefinition): Observable<void> {
		const activeGraph = this.graphService.getCurrentGraph();

		const insertString = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        INSERT DATA { 
			GRAPH <${activeGraph}> {
                <${serviceDefinition.baseResourceIri}> wadl:hasResource <${serviceDefinition.serviceIri}>.
                <${serviceDefinition.serviceIri}> rdf:type wadl:Resource;
                a owl:NamedIndividual;
                wadl:hasPath "${serviceDefinition.servicePath}"^^xsd:string.
			}
        }`;
		return this.queryService.update(insertString);
	}

	// TODO: This query can pretty surely be simplified - do it :D
	deleteService(serviceIri: string): Observable<void> {
		const deleteString = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		PREFIX owl: <http://www.w3.org/2002/07/owl#>
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
		DELETE {
			?bodyRepresentationParameterOption ?predicate ?object.
		} WHERE {
			<${serviceIri}> wadl:hasMethod ?method.
			?method wadl:hasRequest ?request.
			?request wadl:hasRepresentation ?bodyRepresentation.
			?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.
			?bodyRepresentationParameter wadl:hasParameterOption ?bodyRepresentationParameterOption.
			?bodyRepresentationParameterOption ?predicate ?object.
		};
    
		DELETE {
			?bodyRepresentationParameter ?predicate ?object.
		} WHERE {
        <${serviceIri}> wadl:hasMethod ?method.
			?method wadl:hasRequest ?request.
			?request wadl:hasRepresentation ?bodyRepresentation.
			?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.
			?bodyRepresentationParameter ?predicate ?object.
		};

		DELETE {
			?bodyRepresentation ?predicate ?object.
		} WHERE {
			<${serviceIri}> wadl:hasMethod ?method.
			?method wadl:hasRequest ?request.
			?request wadl:hasRepresentation ?bodyRepresentation.
			?bodyRepresentation ?predicate ?object.
		};

		DELETE {
			?option ?predicate ?object.
		} WHERE {
			<${serviceIri}> wadl:hasMethod ?method.
			?method wadl:hasRequest ?request.
			?request wadl:hasParameter ?parameter.
			?parameter wadl:hasParameterOption ?option.
			?option ?predicate ?object.
        };

		DELETE {
			?parameter ?predicate ?object.
		} WHERE {
			<${serviceIri}> wadl:hasMethod ?method.
			?method wadl:hasRequest ?request.
			?request wadl:hasParameter ?parameter.
			?parameter ?predicate ?object.
        };
		
		DELETE {
			?request ?predicate ?object.
		} WHERE {
			<${serviceIri}> wadl:hasMethod ?method.
			?method wadl:hasRequest ?request.
			?request ?predicate ?object.
		};

		DELETE {
			?bodyRepresentationParameterOption ?predicate ?object.
		} WHERE {
			<${serviceIri}> wadl:hasMethod ?method.
			?method wadl:hasResponse ?response.
			?response wadl:hasRepresentation ?bodyRepresentation.
			?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.
			?bodyRepresentationParameter wadl:hasParameterOption ?bodyRepresentationParameterOption.
			?bodyRepresentationParameterOption ?predicate ?object.
		};
		
		DELETE {
			?bodyRepresentationParameter ?predicate ?object.
		} WHERE {
			<${serviceIri}> wadl:hasMethod ?method.
			?method wadl:hasResponse ?response.
			?response wadl:hasRepresentation ?bodyRepresentation.
			?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.
			?bodyRepresentationParameter ?predicate ?object.
		};

		DELETE {
			?bodyRepresentation ?predicate ?object.
		} WHERE {
			<${serviceIri}> wadl:hasMethod ?method.
			?method wadl:hasResponse ?response.
			?response wadl:hasRepresentation ?bodyRepresentation.
			?bodyRepresentation ?predicate ?object.
		};
		
		DELETE {
			?response ?predicate ?object.
		} WHERE {
			<${serviceIri}> wadl:hasMethod ?method.
			?method wadl:hasResponse ?response.
			?response ?predicate ?object.
		};

		DELETE {
			?method ?predicate ?object.
		} WHERE {
			<${serviceIri}> wadl:hasMethod ?method.
			?method ?predicate ?object.
		};

		DELETE WHERE {
			<${serviceIri}> ?predicate ?object.
		}`;

		return this.queryService.update(deleteString);
	}


	/**
 * Get all methods as a SparqlResponse object
 * @returns All currently existing methods
 */
	getMethods(): Observable < SparqlResponse > {
		const queryString = `PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		SELECT DISTINCT ?methods WHERE {
			?methods sesame:directSubClassOf wadl:Method.
		}`;
		return this.queryService.query(queryString);
	}


	addRequest() {
		// const activeGraph = this.graphService.getCurrentGraph();
		// const queryString =  `
		// PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		// PREFIX owl: <http://www.w3.org/2002/07/owl#>
		// PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		// PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
	

		// INSERT DATA {
		//     GRAPH <${activeGraph}> {
		// 		?service wadl:hasMethod ?method.
		// 		?method rdf:type <${variables.methodTypeIRI}>;
		// 			a owl:NamedIndividual;
		// 			wadl:hasRequest ?request.
	
		// 		?request rdf:type wadl:Request;
		// 			a owl:NamedIndividual.
				
		// 		# for parameter
		// 		?request wadl:hasParameter ?parameter.	
				
		// 		?parameter rdf:type ?parameterType;
		// 			a owl:NamedIndividual;
		// 			wadl:hasParameterName "${variables.parameterKey}"^^xsd:NMTOKEN;
		// 			wadl:hasParameterOption ?option;
		// 			wadl:hasParameterType "${variables.parameterDataType}"^^xsd:string;		// For string parameter type
		// 			wadl:hasOntologicalParameterType <${variables.parameterDataTypeABox}>;	// For pointing to type individuals
		// 			rdf:type <${variables.parameterDataTypeTBox}>.							// For type classes
	
		// 		?option rdf:type wadl:Option;
		// 			a owl:NamedIndividual;
		// 			wadl:hasOptionValue "${variables.optionValue}"^^xsd:string.
	
		// 		# for representation
		// 		?request wadl:hasRepresentation ?bodyRepresentation.
		// 		?bodyRepresentation rdf:type wadl:Representation;
		// 			a owl:NamedIndividual;
		// 			wadl:hasMediaType "${variables.bodyRepresentationMediaType}";
		// 			wadl:hasParameter ?bodyRepresentationParameter.
	
		// 		?bodyRepresentationParameter rdf:type wadl:Parameter;
		// 			a owl:NamedIndividual;
		// 			wadl:hasParameterName "${variables.bodyRepresentationParameterKey}"^^xsd:NMTOKEN;
		// 			wadl:hasParameterOption ?bodyRepresentationParameterOption.
		// 			?bodyRepresentationParameter wadl:hasParameterType "${variables.bodyRepresentationParameterDataType}"^^xsd:string;
		// 				wadl:hasOntologicalParameterType <${variables.bodyRepresentationParameterDataTypeOntologicalABox}>;
		// 				rdf:type <${variables.bodyRepresentationParameterDataTypeOntologicalTBox}>.
	
		// 		?bodyRepresentationParameterOption rdf:type wadl:Option;
		// 			a owl:NamedIndividual;
		// 			wadl:hasOptionValue "${variables.bodyRepresentationParameterOptionValue}"^^xsd:string.
		// 	}
	
		//   } WHERE {
		// 	BIND(<${variables.serviceIRI}> AS ?service).
		// 	BIND(<${variables.methodIRI}> AS ?method).
		// 	BIND(<${variables.requestIRI}> AS ?request).
		// 	BIND(<${variables.bodyRepresentationIRI}> AS ?bodyRepresentation).
		// 	BIND(<${variables.bodyRepresentationParameterIRI}> AS ?bodyRepresentationParameter).
		// 	BIND(<${variables.bodyRepresentationParameterOptionIRI}> AS ?bodyRepresentationParameterOption).
		//   }`;
		
	}


	/**
 * Get all possible response codes as a SparqlResponse object 
 * @returns All reponse codes (these are subclasses of the response class)
 */
	getAllResponseCodes(): Observable < SparqlResponse > {
		const queryString = `PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		SELECT DISTINCT ?responseCode WHERE {
			?responseCode sesame:directSubClassOf wadl:Response.
		}`;
		return this.queryService.query(queryString);
	}

	/**
 * Gets all parameter types as a SparqlResponse object
 * @returns All different types of parameters that can be sent via HTTP
 */
	getParameterTypes(): Observable < SparqlResponse > {
		const queryString = `PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		SELECT DISTINCT ?parameterType
		WHERE {
			?parameter sesame:directSubClassOf wadl:Parameter.
		}`;
		return this.queryService.query(queryString);
	}

	getRequestParameter(serviceIri: string, methodTypeIri: string, parameterTypeIri: string): Observable < SparqlResponse > {
		const queryString = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		PREFIX owl: <http://www.w3.org/2002/07/owl#>
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>

		SELECT DISTINCT ?parameter ?parameterKey ?dataType ?optionValue WHERE {
			<${serviceIri}> wadl:hasMethod ?method.
			?method rdf:type <${methodTypeIri}>;
				wadl:hasRequest ?request.
			?request rdf:type wadl:Request;
				wadl:hasParameter ?parameter.
			?parameter rdf:type <${parameterTypeIri}>;
				wadl:hasParameterName ?parameterKey.

			OPTIONAL {?parameter  wadl:hasParameterType ?nonOntologicalDataType.}
			OPTIONAL {?parameter  wadl:hasOntologicalParameterType ?ontologicalDataTypeABox.}
			OPTIONAL {?parameter  rdf:type ?ontologicalDataTypeTBox. MINUS {?ontologicalDataTypeTBox rdfs:subClassOf wadl:Parameter.}
			FILTER(STRSTARTS(STR(?ontologicalDataTypeTBox), "http://www.hsu-ifa.de"))
		}
		{BIND(IF(STRLEN(?nonOntologicalDataType) > 0 ,?nonOntologicalDataType,BNODE()) AS ?dataType).}UNION
		{BIND(IF(BOUND(?ontologicalDataTypeABox),?ontologicalDataTypeABox,BNODE()) AS ?dataType).}UNION
		{BIND(IF(BOUND(?ontologicalDataTypeTBox),?ontologicalDataTypeTBox,BNODE()) AS ?dataType).}
		
		FILTER(!ISBLANK(?dataType))

		OPTIONAL{
			?parameter wadl:hasParameterOption ?option.
			?option rdf:type wadl:Option;
			a owl:NamedIndividual;
			wadl:hasOptionValue ?optionValue.}
		} `;

		return this.queryService.query(queryString);
	}

}