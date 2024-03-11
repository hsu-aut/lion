import { Injectable } from "@nestjs/common";
import { WadlParameter, WadlParameterDto, WadlTypesOfDataTypes } from "@shared/models/odps/wadl/WadlParameter";
import { Observable, map } from "rxjs";
import { SparqlResponse } from "../../models/sparql/SparqlResponse";
import { SparqlService } from "../../shared-services/sparql.service";
import { MappingDefinition, SparqlResultConverter } from "sparql-result-converter";

@Injectable()
export class WadlParameterService {

	converter = new SparqlResultConverter();

	constructor(
		private queryService: SparqlService
	) { }


	/**
 * Gets all parameter types as a SparqlResponse object
 * @returns All different types of parameters that can be sent via HTTP
 */
	getParameterTypes(): Observable<SparqlResponse> {
		const queryString = `PREFIX wadl: <http://www.w3id.org/hsu-aut/WADL#>
	SELECT DISTINCT ?parameterType WHERE {
		?parameterType sesame:directSubClassOf wadl:Parameter.
	}`;
		return this.queryService.query(queryString);
	}


	getParameters(parentIri: string): Observable<WadlParameterDto[]> {
		const queryString = `
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		PREFIX owl: <http://www.w3.org/2002/07/owl#>
		PREFIX wadl: <http://www.w3id.org/hsu-aut/WADL#>

		SELECT DISTINCT ?parentIri ?parameterIri ?name ?type ?required ?default ?dataType ?value WHERE {
			BIND(<${parentIri}> as ?parentIri)
			?parentIri wadl:hasParameter ?parameterIri.
			?parameterIri rdf:type ?type;
				wadl:hasParameterName ?name.
			?type rdfs:subClassOf wadl:Parameter.

			{OPTIONAL {?parameterIri wadl:hasParameterRequired ?required.}}
			{OPTIONAL {?parameterIri wadl:hasParameterDefault ?default.}}
			{OPTIONAL {?parameterIri  wadl:hasParameterType ?dataType.}} UNION
			{OPTIONAL {?parameterIri  wadl:hasOntologicalParameterType ?dataType.}} UNION
			{OPTIONAL {
				?parameterIri  rdf:type ?dataType. 
				MINUS {?ontologicalDataTypeTBox rdfs:subClassOf wadl:Parameter.}
			}}
		
			FILTER(!ISBLANK(?dataType))

			OPTIONAL{
				?parameterIri wadl:hasParameterOption ?option.
				?option rdf:type wadl:Option;
				a owl:NamedIndividual;
				wadl:hasOptionValue ?value.
			}
		} `;

		return this.queryService.query(queryString).pipe(map(rawResult => {
			const mappedResult = this.converter.convertToDefinition(rawResult.results.bindings, parameterMappingDefinition)
				.getFirstRootElement() as Array<WadlParameterDto>;
			
			return mappedResult;
		}));

	}



	/**
     * Creates a SPARQL insert for an array of WADL parameters
     * @param parameters Array of WADL parameters
     * @returns SPARQL insert
     */
	createParameterInsertString(parameters: WadlParameter[]): string{			
		const parameterString = parameters.map(param => {
			let paramString = `
			<${param.parentIri}> wadl:hasParameter <${param.parameterIri}>.
			<${param.parameterIri}> a <${param.parameterType}>;
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
				<${param.parameterIri}>	wadl:hasParameterOption <${option.iri}>.
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
		const parameterString = this.createParameterInsertString(parameters);
		const updateString = `
			PREFIX wadl: <http://www.w3id.org/hsu-aut/WADL#>	
			INSERT DATA {
				${parameterString}
			}
		`;
		return this.queryService.update(updateString);
	}

	deleteParameter(parameterIri: string): Observable<void> {
		const deleteString = `
		PREFIX wadl: <http://www.w3id.org/hsu-aut/WADL#>

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

	deleteAllParametersOfParent(parentIri: string): Observable<void> {
		const deleteString = `
		PREFIX wadl: <http://www.w3id.org/hsu-aut/WADL#>
		DELETE {
			<${parentIri}> wadl:hasParameter ?parameterIri.
			?parameterIri a ?paramType;
				a owl:NamedIndividual;
				wadl:hasParameterName ?name;
				?typeProp ?type.
		} WHERE {
			VALUES ?typeProp {wadl:hasParameterType wadl:hasOntologicalParameterType }
			OPTIONAL {
				?parameterIri wadl:hasParameterDefault ?default.
			}
			OPTIONAL {
				?parameterIri wadl:hasParameterOption ?option.
				?option a wadl:Option;
						a owl:NamedIndividual;
						wadl:hasOptionValue ?optionValue.
			}
		}`;
		return this.queryService.update(deleteString);
	}

}




const parameterMappingDefinition: MappingDefinition[] = [{
	rootName: 'parameter',
	propertyToGroup: 'parameterIri',
	name: 'parameterIri',
	toCollect: ['parameterIri', 'type', 'name', 'parentIri', 'dataType', 'required', 'default'],
	childMappings: [{
		rootName: 'options',
		toCollect: ['value'],
	}]
}];