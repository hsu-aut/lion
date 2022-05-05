import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BaseResourceDefinition } from '@shared/models/odps/wadl/BaseResourceDefinition';
import { SparqlResponse } from '../../models/sparql/SparqlResponse';
import { SparqlService } from '../../shared-services/sparql.service';

@Injectable()
export class WadlService {

	constructor(private queryService: SparqlService) { }

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
		// TODO: Add graph back in. Comments show how it was done in frontend
		// const GRAPHS = this.graphs.getGraphs();
		// const activeGraph = GRAPHS[this.graphs.getActiveGraph()];
		const activeGraph = "dummy";
		const updateString = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        INSERT {
            # GRAPH <${activeGraph}> {

            ?baseResource rdf:type wadl:Resources;
            a owl:NamedIndividual;
            wadl:hasBase "${baseResource.baseResourcePath}"^^xsd:anyURI;
            wadl:RestResourcesAreProvidedByEntity ?serviceProvider.

        #}
        } WHERE {
            BIND(<${baseResource.baseResourceIri}> AS ?baseResource).
            BIND(<${baseResource.serviceProviderIri}> AS ?serviceProvider).
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
	 * Get all methods as a SparqlResponse object
	 * @returns All currently existing methods
	 */
	getMethods(): Observable<SparqlResponse> {
		const queryString = `PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		SELECT DISTINCT ?methods WHERE {
			?methods sesame:directSubClassOf wadl:Method.
		}`;
		return this.queryService.query(queryString);
	}

	/**
	 * Get all possible response codes as a SparqlResponse object 
	 * @returns All reponse codes (these are subclasses of the response class)
	 */
	getAllResponseCodes(): Observable<SparqlResponse> {
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
	getParameterTypes(): Observable<SparqlResponse> {
		const queryString = `PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		SELECT DISTINCT ?parameterType
		WHERE {
			?parameter sesame:directSubClassOf wadl:Parameter.
		}`;
		return this.queryService.query(queryString);
	}

	getRequestParameter(serviceIri: string, methodTypeIri: string, parameterTypeIri: string): Observable<SparqlResponse> {
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