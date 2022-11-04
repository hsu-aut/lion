import { Injectable } from "@nestjs/common";
import { WadlParameter, WadlParameterTypes, WadlTypesOfDataTypes } from "@shared/models/odps/wadl/WadlParameter";
import { Observable } from "rxjs";
import { SparqlResponse } from "../../models/sparql/SparqlResponse";
import { SparqlService } from "../../shared-services/sparql.service";

@Injectable()
export class WadlParameterService {

	constructor(
		private queryService: SparqlService
	) { }


	/**
 * Gets all parameter types as a SparqlResponse object
 * @returns All different types of parameters that can be sent via HTTP
 */
	getParameterTypes(): Observable<SparqlResponse> {
		const queryString = `PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
	SELECT DISTINCT ?parameterType WHERE {
		?parameterType sesame:directSubClassOf wadl:Parameter.
	}`;
		return this.queryService.query(queryString);
	}

	getParameters(parentIri: string): Observable <SparqlResponse> {
		const queryString = `
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX owl: <http://www.w3.org/2002/07/owl#>
	PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>

	SELECT DISTINCT ?parameter ?parameterKey ?dataType ?optionValue WHERE {
		<${parentIri}> wadl:hasParameter ?parameter.
		?parameter rdf:type ?parameterType;
			wadl:hasParameterName ?parameterKey.
		?parameterType rdfs:subClassOf wadl:Parameter.

		{OPTIONAL {?parameter  wadl:hasParameterType ?dataType.}} UNION
		{OPTIONAL {?parameter  wadl:hasOntologicalParameterType ?dataType.}} UNION
		{OPTIONAL {
			?parameter  rdf:type ?dataType. 
			MINUS {?ontologicalDataTypeTBox rdfs:subClassOf wadl:Parameter.}
		}}
	
		FILTER(!ISBLANK(?dataType))

		OPTIONAL{
			?parameter wadl:hasParameterOption ?option.
			?option rdf:type wadl:Option;
			a owl:NamedIndividual;
			wadl:hasOptionValue ?optionValue.
		}
	} `;

		return this.queryService.query(queryString);
	}



	/**
     * Creates a SPARQL insert for an array of WADL parameters
     * @param parameters Array of WADL parameters
     * @returns SPARQL insert
     */
	createParameterString(parameters: WadlParameter[]): string{			
		const parameterString = parameters.map(param => {
			let paramString = `
			<${param.parentIri}> wadl:hasParameter <${param.parameterIri}>.
			<${param.parameterIri}> a <${WadlParameterTypes[param.parameterType]}>;
					a owl:NamedIndividual;
					wadl:hasParameterName "${param.name}"^^xsd:NMTOKEN;
					`;
			
			switch (param.typeOfDataType) {
			case WadlTypesOfDataTypes.NonOntological:
				paramString += `wadl:hasParameterType "${param.dataType}"^^xsd:string.`;
				break;
			case WadlTypesOfDataTypes.ABox:
				paramString += `wadl:hasOntologicalParameterType "${param.dataType}"^^xsd:string.`;
				break;
			case WadlTypesOfDataTypes.TBox:
				paramString += `a "${param.dataType}"^^xsd:string.`;
				break;
			}

			const optionString = param.options.map(option => {
				const opString = `
					wadl:hasParameterOption <${option.iri}>;
				<${option.iri}> a wadl:Option;
					a owl:NamedIndividual;
				wadl:hasOptionValue "${option.value}".`;
				return opString;
			});
			
			paramString += optionString.join("");

			return paramString;
		});
		return parameterString.join("");
	}


	addParameters(parameters: WadlParameter[]): Observable<void> {
		const parameterString = this.createParameterString(parameters);
		const updateString = `
			PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>	
			INSERT DATA {
				${parameterString}
			}
		`;
		console.log(updateString);
		
		return this.queryService.update(updateString);
	}

	deleteParameter(parameterIri: string): Observable<void> {
		const deleteString = `
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>

		DELETE WHERE {
			?parent wadl:hasParameter <${parameterIri}>.
			<${parameterIri}> a ?paramType;
				a owl:NamedIndividual;
				wadl:hasParameterName ?name.
		};
		DELETE WHERE {
			<${parameterIri}> wadl:hasParameterType ?dataType.
		};
		DELETE WHERE {
			<${parameterIri}> wadl:hasOntologicalParameterType ?ontologicalABoxType.
		};
		DELETE WHERE {
			<${parameterIri}> wadl:hasParameterOption ?option.
			?option a wadl:Option;
					a owl:NamedIndividual;
					wadl:hasOptionValue ?optionValue.
		};
		DELETE WHERE {
			<${parameterIri}> wadl:hasParameterDefault ?default.
		}`;
		return this.queryService.update(deleteString);
	}

}