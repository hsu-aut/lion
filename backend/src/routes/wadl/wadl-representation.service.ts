import { Injectable } from "@nestjs/common";
import { WadlRepresentation, WadlRepresentationDto } from "@shared/models/odps/wadl/WadlRepresentation";
import { Observable, firstValueFrom, map, of} from "rxjs";
import { SparqlService } from "../../shared-services/sparql.service";
import { WadlParameterService } from "./wadl-parameter.service";
import { MappingDefinition, SparqlResultConverter } from "sparql-result-converter";

@Injectable()
export class WadlRepresentationService {

	converter = new SparqlResultConverter()

	constructor(
        private wadlParamService: WadlParameterService,
		private sparqlService: SparqlService
	){}


	async getRepresentations(parentIri?: string): Promise<WadlRepresentationDto[]> {
		let filterString = "";
		if(parentIri) filterString = `BIND(<${parentIri}> AS ?parentIri)`; 

		const queryString = `
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		SELECT ?representationIri ?mediaType ?parentIri WHERE {
			${filterString}
			?parentIri wadl:hasRepresentation ?representationIri.
			?representationIri a wadl:Representation;
				wadl:hasMediaType ?mediaType.
		}`;

		const rawResult = await firstValueFrom(this.sparqlService.query(queryString));
		const mappedRepresentations = this.converter.convertToDefinition(rawResult.results.bindings, representationMapping)
			.getFirstRootElement() as Array<WadlRepresentationDto>;
		
		for (const rep of mappedRepresentations) {
			const repParameterDtos = await firstValueFrom(this.wadlParamService.getParameters(rep.representationIri));
			rep.parameters = repParameterDtos;
		}
		
		return mappedRepresentations;
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
			<${representation.parentIri}> wadl:hasRepresentation <${representation.representationIri}>.
			<${representation.representationIri}> a wadl:Representation;
				a owl:NamedIndividual;
				wadl:hasMediaType "${representation.mediaType}".`;
			
			// Create and add representation parameters
			const repParamString = this.wadlParamService.createParameterInsertString(representation.parameters);
			repString += repParamString;
		});
		
		
		return repString;
	}

	addRepresentation(rep: WadlRepresentation): Observable<WadlRepresentation> {
		const repString = this.createRepresentationString([rep]);
		const updateQuery = `
			PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
			INSERT DATA {
				${repString}
			}
		`;
		return this.sparqlService.update(updateQuery).pipe(map(res => rep));
	}

	async deleteRepresentation(representationIri: string): Promise<void> {
		// Delete all parameters of this representation first
		await firstValueFrom(this.wadlParamService.deleteAllParametersOfParent(representationIri));
		
		const deleteQuery = `
			PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
			PREFIX owl: <http://www.w3.org/2002/07/owl#>
			DELETE WHERE {
				?parentIri wadl:hasRepresentation <${representationIri}>.
				<${representationIri}> a wadl:Representation, owl:NamedIndividual;
					wadl:hasMediaType ?mediaType.
			}
		`;

		return firstValueFrom(this.sparqlService.update(deleteQuery));
	}

}


const representationMapping : MappingDefinition[] = [{
	rootName: 'representationIri',
	propertyToGroup: 'representation',
	name: 'iri',
	toCollect: ['mediaType', 'parentIri'],
}];