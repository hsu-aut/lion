import { Injectable } from "@nestjs/common";
import { WadlRepresentation } from "@shared/models/odps/wadl/WadlRepresentation";
import { Observable } from "rxjs";
import { SparqlService } from "../../shared-services/sparql.service";
import { WadlParameterService } from "./wadl-parameter.service";

@Injectable()
export class WadlRepresentationService {

	constructor(
        private wadlParamService: WadlParameterService,
		private sparqlService: SparqlService
	){}


	getRepresentations(parentIri: string) {
		const queryString = `
		SELECT ?representation ?mediaType WHERE {
		<${parentIri}> wadl:hasRepresentation ?representation.
			?representation a wadl:Representation;
				a owl:NamedIndividual;
				wadl:hasMediaType ?mediaType.
		}`;
		return this.sparqlService.query(queryString);
	}


	/**
     * Creates a SPARQL insert for a WADL representation
     * @param parameters A WADL representation
     * @returns SPARQL insert
     */
	createRepresentationString(representations: Array<WadlRepresentation>): string{
		let repString = "";
		
		representations.forEach(representation => {
			repString += `
			<${representation.parentIri}> wadl:hasRepresentation <${representation.iri}>.
			<${representation.iri}> a wadl:Representation;
				a owl:NamedIndividual;
				wadl:hasMediaType "${representation.mediaType}".`;
			
			// Create and add representation parameters
			const repParamString = this.wadlParamService.createParameterString(representation.parameters);
			repString += repParamString;
		});

		return repString;
	}

	addRepresentation(rep: WadlRepresentation): Observable<void> {
		const repString = this.createRepresentationString([rep]);
		const updateQuery = `
			PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
			INSERT DATA {
				${repString}
			}
		`;
		
		return this.sparqlService.update(updateQuery);
	}

}