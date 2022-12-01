import { Injectable } from "@nestjs/common";
import { WadlCreateRequestDto, WadlRequest, WadlRequestDto } from "../../models/odps/wadl/WadlRequest";
import { SparqlService } from "../../shared-services/sparql.service";
import { MappingDefinition, SparqlResultConverter } from "sparql-result-converter";
import { lastValueFrom } from "rxjs";
import { WadlCreateResponseDto, WadlResponseDto } from "../../models/odps/wadl/WadlResponse";

@Injectable()
export class WadlResponseService {

	converter = new SparqlResultConverter();

	constructor(
		private queryService: SparqlService,
	) { }


	async addResponse(createResponseDto: WadlCreateResponseDto): Promise<WadlResponseDto> {
		const {resourceIri, methodTypeIri, statusCode} = createResponseDto;
		const statusCodeNumber = statusCode.split('#')[1];		// TODO: This is pretty bad. IRIs should be objects of an IRI class that has this method
		const methodIri = `${resourceIri}_${statusCodeNumber}`;
		const responseIri = `${methodIri}_Res`;
		const query = `
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		INSERT DATA {
			<${createResponseDto.resourceIri}> wadl:hasMethod <${methodIri}>.
			<${methodIri}> a <${methodTypeIri}>;
				wadl:hasResponse <${responseIri}>.
			<${responseIri}> a wadl:Response,
								<wadl:${statusCodeNumber}>.
		}`;
		console.log(query);
		
		await lastValueFrom(this.queryService.update(query));
		return this.getResponse(resourceIri, methodTypeIri, statusCode);
	}


	async getResponse(resourceIri: string, methodTypeIri: string, statusCode: string): Promise<WadlResponseDto> {
		const statusCodeNumber = statusCode.split('#')[1];		// TODO: This is pretty bad. IRIs should be objects of an IRI class that has this method
		const queryString = `
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		SELECT * WHERE {
			<${resourceIri}> wadl:hasMethod ?methodIri.
			?methodIri a <${methodTypeIri}>;
					wadl:hasResponse ?responseIri.
			?responseIri a wadl:${statusCodeNumber}.
			OPTIONAL {
				?responseIri wadl:hasParameter ?parameterIri.
				?parameterIri a ?type;
					wadl:hasParameterName ?name;
					wadl:hasParameterType ?dataType.
				?type rdfs:subClassOf wadl:Parameter.
				OPTIONAL {
					?parameterIri wadl:hasOption ?option.
					?option wadl:hasOptionValue ?value.
				}
			}
			OPTIONAL {
				?responseIri wadl:hasRepresentation ?bodyRepresentation. 
				?bodyRepresentation a wadl:Representation;
					wadl:hasMediaType ?bodyMediaType;
				OPTIONAL {
					?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.
					?bodyRepresentationParameter a wadl:Parameter;
						wadl:hasParameterName ?bodyParameterKey;
						wadl:hasParameterType ?parameterType.
				}
			}
			
			
		}`;

		// OPTIONAL {
		// 	?bodyRepresentationParameter  wadl:hasParameterType ?nonOntologicalDataType.
		// }
		// OPTIONAL {
		// 	?bodyRepresentationParameter  wadl:hasOntologicalParameterType ?ontologicalDataTypeABox.
		// }
		// OPTIONAL {
		// 	?bodyRepresentationParameter  rdf:type ?ontologicalDataTypeTBox.
		// 	MINUS {
		// 		?ontologicalDataTypeTBox rdfs:subClassOf wadl:Parameter.
		// 	}
		// 	FILTER(STRSTARTS(STR(?ontologicalDataTypeTBox), "http://www.hsu-ifa.de"))
		// }
		// {
		// 	BIND(IF(STRLEN(?nonOntologicalDataType) > 0 ,?nonOntologicalDataType,BNODE()) AS ?bodyDataType).
		// }UNION
		// {
		// 	BIND(IF(BOUND(?ontologicalDataTypeABox),?ontologicalDataTypeABox,BNODE()) AS ?bodyDataType).
		// }UNION
		// {
		// 	BIND(IF(BOUND(?ontologicalDataTypeTBox),?ontologicalDataTypeTBox,BNODE()) AS ?bodyDataType).
		// }
		// FILTER(!ISBLANK(?bodyDataType))
		// OPTIONAL {
		// 	?bodyRepresentationParameter wadl:hasParameterOption ?bodyRepresentationParameterOption.
		// 	?bodyRepresentationParameterOption rdf:type wadl:Option;
		// 	wadl:hasOptionValue ?bodyOptionValue.
		// }

		console.log(queryString);
		
		const rawResult = await lastValueFrom(this.queryService.query(queryString));
		const mappedResult = this.converter.convertToDefinition(rawResult.results.bindings, responseMappingDefinition)
			.getFirstRootElement() as Array<WadlResponseDto>;
		
		return mappedResult[0];
	}
}

const responseMappingDefinition: MappingDefinition[] = [{
	rootName: 'responseIri',
	propertyToGroup: 'responseIri',
	name: 'responseIri',
	toCollect: ['methodIri', 'statusCode'],
	childMappings: [{
		rootName: 'parameters',
		toCollect: ['name', 'type', 'dataType'],
		childMappings: [{
			rootName: 'options',
			toCollect: ['value']
		}],
	},
	{
		rootName: 'representations',
		propertyToGroup: 'representationIri',
		childMappings: [{
			rootName: 'parameters',
			toCollect: ['parameterName', 'parameterType']
		}],
	}]
}];