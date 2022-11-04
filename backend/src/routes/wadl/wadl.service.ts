import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SparqlService } from '../../shared-services/sparql.service';
import { WadlBaseResource } from '@shared/models/odps/wadl/BaseResource';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { WadlResource } from '@shared/models/odps/wadl/Resource';
import { GraphOperationService } from '../../shared-services/graph-operation.service';
import { WadlMethod } from '@shared/models/odps/wadl/WadlMethod';
import { WadlParameterService } from './wadl-parameter.service';
import { WadlRepresentationService } from './wadl-representation.service';

@Injectable()
export class WadlService {

	constructor(
		private wadlParamService: WadlParameterService,
		private wadlRepService: WadlRepresentationService,
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

	addBaseResource(baseResource: WadlBaseResource): Observable<void> {
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
	getResources(baseResource = ""): Observable<SparqlResponse> {
		let filterString = "";
		if (baseResource) { filterString = `FILTER (?baseResource = <${baseResource}>)`; }
		
		const queryString = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		SELECT ?baseResource ?serviceProvider ?basePath ?resource ?resourcePath WHERE {
			?baseResource wadl:hasBase ?basePath;
				wadl:RestResourcesAreProvidedByEntity ?serviceProvider.
				
			OPTIONAL {
				?baseResource wadl:hasResource ?resource.

				?resource rdf:type wadl:Resource;
					a owl:NamedIndividual;
					wadl:hasPath ?resourcePath.
			}
			${filterString}
		}`;
		return this.queryService.query(queryString);
	}

	/**
	 * Inserts a new service into the current graph
	 * @param serviceDefinition A service definition object containing info about the service to insert
	 * @returns 
	 */
	addResource(serviceDefinition: WadlResource): Observable<void> {
		const activeGraph = this.graphService.getCurrentGraph();

		const insertString = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        INSERT DATA { 
			GRAPH <${activeGraph}> {
                <${serviceDefinition.baseResourceIri}> wadl:hasResource <${serviceDefinition.resourceIri}>.
                <${serviceDefinition.resourceIri}> rdf:type wadl:Resource;
                a owl:NamedIndividual;
                wadl:hasPath "${serviceDefinition.resourcePath}"^^xsd:string.
			}
        }`;
		return this.queryService.update(insertString);
	}

	// TODO: This query can pretty surely be simplified - do it :D
	deleteResource(serviceIri: string): Observable<void> {
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
	getMethodTypes(): Observable < SparqlResponse > {
		const queryString = `PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		SELECT DISTINCT ?methods WHERE {
			?methods sesame:directSubClassOf wadl:Method.
		}`;
		return this.queryService.query(queryString);
	}


	addMethod(method: WadlMethod): Observable<void> {
		const activeGraph = this.graphService.getCurrentGraph();
		
		const parameterString = this.wadlParamService.createParameterString(method.request.parameters);
		const repString = this.wadlRepService.createRepresentationString(method.request.representations);
		const updateString = `
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		PREFIX owl: <http://www.w3.org/2002/07/owl#>
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

		INSERT DATA{ 
			GRAPH <${activeGraph}> {
				<${method.resourceIri}> wadl:hasMethod <${method.methodIri}>.
				<${method.methodIri}> rdf:type <${method.methodTypeIri}>;
					wadl:hasRequest <${method.request.requestIri}>.
				<${method.request.requestIri}> rdf:type wadl:Request;
					a owl:NamedIndividual.
				${parameterString}
				${repString}
			}
		}`;
		console.log(updateString);
		return this.queryService.update(updateString);
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


	getRequestRepresentation(serviceIri: string, methodTypeIri: string): Observable <SparqlResponse>  {
		const queryString = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		PREFIX owl: <http://www.w3.org/2002/07/owl#>
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
	
		PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
		SELECT DISTINCT ?bodyRepresentation ?bodyMediaType ?bodyParameterKey ?bodyDataType ?bodyOptionValue WHERE {
		BIND(<${serviceIri}> AS ?service).
		BIND(<${methodTypeIri}> AS ?methodType).
	
		?service wadl:hasMethod ?method.
		?method a ?methodType.
	
		?method rdf:type ?Method;
			a owl:NamedIndividual;
			wadl:hasRequest ?request.
	
		?request rdf:type wadl:Request;
			a owl:NamedIndividual;
			wadl:hasRepresentation ?bodyRepresentation.
	
		?bodyRepresentation rdf:type wadl:Representation;
			a owl:NamedIndividual;
			wadl:hasMediaType ?bodyMediaType;
			wadl:hasParameter ?bodyRepresentationParameter.
	
		?bodyRepresentationParameter rdf:type wadl:Parameter;
			a owl:NamedIndividual;
			wadl:hasParameterName ?bodyParameterKey.
	
		OPTIONAL {?bodyRepresentationParameter  wadl:hasParameterType ?nonOntologicalDataType.}
		OPTIONAL {?bodyRepresentationParameter  wadl:hasOntologicalParameterType ?ontologicalDataTypeABox.}
		OPTIONAL {
			?bodyRepresentationParameter  rdf:type ?ontologicalDataTypeTBox. 
			MINUS {?ontologicalDataTypeTBox rdfs:subClassOf wadl:Parameter.}
			FILTER(STRSTARTS(STR(?ontologicalDataTypeTBox), "http://www.hsu-ifa.de"))
		}
		{BIND(IF(STRLEN(?nonOntologicalDataType) > 0 ,?nonOntologicalDataType,BNODE()) AS ?bodyDataType).}UNION
		{BIND(IF(BOUND(?ontologicalDataTypeABox),?ontologicalDataTypeABox,BNODE()) AS ?bodyDataType).}UNION
		{BIND(IF(BOUND(?ontologicalDataTypeTBox),?ontologicalDataTypeTBox,BNODE()) AS ?bodyDataType).}
		FILTER(!ISBLANK(?bodyDataType))
	
		OPTIONAL {
			?bodyRepresentationParameter wadl:hasParameterOption ?bodyRepresentationParameterOption.
			?bodyRepresentationParameterOption rdf:type wadl:Option;
			a owl:NamedIndividual;
			wadl:hasOptionValue ?bodyOptionValue.
		}} `;
		

		return this.queryService.query(queryString);
	}

}