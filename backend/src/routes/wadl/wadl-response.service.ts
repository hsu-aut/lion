import { Injectable } from "@nestjs/common";
import { WadlCreateRequestDto, WadlRequest, WadlRequestDto } from "../../models/odps/wadl/WadlRequest";
import { SparqlService } from "../../shared-services/sparql.service";
import { MappingDefinition, SparqlResultConverter } from "sparql-result-converter";
import { lastValueFrom } from "rxjs";
import { WadlCreateResponseDto, WadlResponseDto } from "../../models/odps/wadl/WadlResponse";
import { WadlParameterService } from "./wadl-parameter.service";
import { WadlRepresentationService } from "./wadl-representation.service";

@Injectable()
export class WadlResponseService {

	converter = new SparqlResultConverter();

	constructor(
		private queryService: SparqlService,
		private parameterService: WadlParameterService,
		private representationService: WadlRepresentationService
	) { }


	async addResponse(createResponseDto: WadlCreateResponseDto): Promise<WadlResponseDto> {
		const {resourceIri, methodTypeIri, statusCode} = createResponseDto;
		const statusCodeNumber = statusCode.split('#')[1];		// TODO: This is pretty bad. IRIs should be objects of an IRI class that has this method
		const methodType = methodTypeIri.split('#')[1];

		const responseIri = `${resourceIri}_${methodType}_Res_${statusCodeNumber}`;

		const query = `
		PREFIX wadl: <http://www.w3id.org/hsu-aut/WADL#>
		INSERT {
			<${createResponseDto.resourceIri}> wadl:hasMethod ?method.
			?method wadl:hasResponse <${responseIri}>.
			<${responseIri}> a wadl:Response,
								<${statusCode}>.
		} WHERE {
			<${createResponseDto.resourceIri}> wadl:hasMethod ?method.
			?method a <${methodTypeIri}>;
		}`;
		await lastValueFrom(this.queryService.update(query));
		return this.getResponse(resourceIri, methodTypeIri, statusCode);
	}


	async getResponse(resourceIri: string, methodTypeIri: string, statusCode: string): Promise<WadlResponseDto> {
		const queryString = `
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
		PREFIX wadl: <http://www.w3id.org/hsu-aut/WADL#>
		SELECT * WHERE {
			BIND(<http://www.w3id.org/hsu-aut/WADL#201> AS ?statusCode)
			<${resourceIri}> wadl:hasMethod ?methodIri.
			?methodIri a <${methodTypeIri}>;
					wadl:hasResponse ?responseIri.
			?responseIri a ?statusCode			
		}`;
		
		const rawResult = await lastValueFrom(this.queryService.query(queryString));
		const response = this.converter.convertToDefinition(rawResult.results.bindings, responseMappingDefinition)
			.getFirstRootElement()[0] as WadlResponseDto;

		if(!response) return null;

		const parameters = await lastValueFrom(this.parameterService.getParameters(response.responseIri));
		response.parameters = parameters;

		const representations = await this.representationService.getRepresentations(response.responseIri);
		response.representations = representations;
		
		return response;
	}
}

const responseMappingDefinition: MappingDefinition[] = [{
	rootName: 'responseIri',
	propertyToGroup: 'responseIri',
	name: 'responseIri',
	toCollect: ['methodIri', 'statusCode'],
}];