import { Injectable } from "@nestjs/common";
import { WadlParameter, WadlTypesOfDataTypes } from "@shared/models/odps/wadl/WadlParameter";

@Injectable()
export class WadlParameterService {


	/**
     * Creates a SPARQL insert for an array of WADL parameters
     * @param parameters Array of WADL parameters
     * @returns SPARQL insert
     */
	createParameterString(parentIri: string, parameters: WadlParameter[]): string{
		const parameterString = parameters.map(param => {
			let paramString = `
			<${parentIri}> wadl:hasParameter <${param.iri}>.
			<${param.iri}> rdf:type <${param.type}>;
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

}