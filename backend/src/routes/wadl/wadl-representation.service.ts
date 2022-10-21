import { Injectable } from "@nestjs/common";
import { WadlRepresentation } from "../../models/odps/wadl/WadlRepresentation";
import { WadlParameterService } from "./wadl-parameter.service";

@Injectable()
export class WadlRepresentationService {

	constructor(
        private wadlParamService: WadlParameterService
	){}

	/**
     * Creates a SPARQL insert for a WADL representation
     * @param parameters A WADL representation
     * @returns SPARQL insert
     */
	createRepresentationString(parentIri: string, representations: Array<WadlRepresentation>): string{
		let repString = "";
		
		representations.forEach(representation => {
			repString += `
			<${parentIri}> wadl:hasRepresentation <${representation.iri}>.
			<${representation.iri}> rdf:type wadl:Representation;
				a owl:NamedIndividual;
				wadl:hasMediaType "${representation.mediaType}".`;
			
			// Create and add representation parameters
			const repParamString = this.wadlParamService.createParameterString(representation.iri, representation.parameters);
			repString += repParamString;
		});

		return repString;
	}

}