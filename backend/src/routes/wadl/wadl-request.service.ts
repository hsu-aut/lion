import { Injectable } from "@nestjs/common";
import { WadlCreateRequestDto, WadlRequest, WadlRequestDto } from "../../models/odps/wadl/WadlRequest";
import { SparqlService } from "../../shared-services/sparql.service";
import { MappingDefinition, SparqlResultConverter } from "sparql-result-converter";
import { lastValueFrom } from "rxjs";

@Injectable()
export class WadlRequestService {

	converter = new SparqlResultConverter();

	constructor(
		private queryService: SparqlService,
	) { }


	async addRequest(createRequestDto: WadlCreateRequestDto): Promise<WadlRequestDto> {
		const {resourceIri, methodTypeIri} = createRequestDto;
		const httpMethod = methodTypeIri.split('#')[1];		// TODO: This is pretty bad. IRIs should be objects of an IRI class that has this method
		const methodIri = `${resourceIri}_${httpMethod}`;
		const requestIri = `${methodIri}_Req`;
		const query = `
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		INSERT DATA {
			<${createRequestDto.resourceIri}> wadl:hasMethod <${methodIri}>.
			<${methodIri}> a <${methodTypeIri}>;
				wadl:hasRequest <${requestIri}>.
			<${requestIri}> a wadl:Request.
		}`;

		await lastValueFrom(this.queryService.update(query));
		return this.getRequest(resourceIri, methodTypeIri);
	}

	async getRequest(resourceIri: string, methodTypeIri: string): Promise<WadlRequestDto> {
		const queryString = `
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		SELECT * WHERE {
			<${resourceIri}> wadl:hasMethod ?methodIri.
			?methodIri a <${methodTypeIri}>;
					wadl:hasRequest ?requestIri.
			?requestIri a wadl:Request.
			OPTIONAL {
				?requestIri wadl:hasParameter ?parameterIri.
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
				?requestIri wadl:hasRepresentation ?bodyRepresentation. 
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
		const rawResult = await lastValueFrom(this.queryService.query(queryString));
		const mappedResult = this.converter.convertToDefinition(rawResult.results.bindings, requestMappingDefinition)
			.getFirstRootElement() as Array<WadlRequestDto>;
		
		return mappedResult[0];
	}
}


const requestMappingDefinition: MappingDefinition[] = [{
	rootName: 'requestIri',
	propertyToGroup: 'requestIri',
	name: 'requestIri',
	toCollect: ['methodIri'],
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
