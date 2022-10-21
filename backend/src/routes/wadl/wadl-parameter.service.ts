import { Injectable } from "@nestjs/common";
import { WadlParameter, WadlParameterDto, WadlTypesOfDataTypes } from "@shared/models/odps/wadl/WadlParameter";
import { Observable } from "rxjs";
import { SparqlService } from "../../shared-services/sparql.service";

@Injectable()
export class WadlParameterService {

	constructor(
		private queryService: SparqlService
	) { }


	/**
     * Creates a SPARQL insert for an array of WADL parameters
     * @param parameters Array of WADL parameters
     * @returns SPARQL insert
     */
	createParameterString(parentIri: string, parameterDtos: WadlParameterDto[]): string{
		const parameters = parameterDtos.map(paramDto => WadlParameter.fromDto(parentIri, paramDto));
			
		const parameterString = parameters.map(param => {
			let paramString = `
			<${parentIri}> wadl:hasParameter <${param.parameterIri}>.
			<${param.parameterIri}> rdf:type <${param.parameterType}>;
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
				paramString += `rdf:type "${param.dataType}"^^xsd:string.`;
				break;
			}

			const optionString = param.options.map(option => {
				const opString = `
					wadl:hasParameterOption <${option.iri}>;
				<${option.iri}> rdf:type wadl:Option;
					a owl:NamedIndividual;
				wadl:hasOptionValue "${option.value}".`;
				return opString;
			});
			
			paramString += optionString.join("");

			return paramString;
		});
		return parameterString.join("");
	}


	addParameters(parentIri: string, parameters: WadlParameterDto[]): Observable<void> {
		const updateString = this.createParameterString(parentIri, parameters);
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