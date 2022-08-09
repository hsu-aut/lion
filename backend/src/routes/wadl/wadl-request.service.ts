import { Injectable } from "@nestjs/common";
import { WadlRequest } from "../../models/odps/wadl/WadlRequest";
import { SparqlService } from "../../shared-services/sparql.service";
import { MappingDefinition, SparqlResultConverter } from "sparql-result-converter";
import { lastValueFrom } from "rxjs";

@Injectable()
export class WadlRequestService {

	converter = new SparqlResultConverter();

	constructor(
		private queryService: SparqlService,
	) { }


	async getRequest(resourceIri: string, methodTypeIri: string): Promise<WadlRequest> {
		const queryString = `
		PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
		SELECT * WHERE {
			BIND(<${methodTypeIri}> AS ?methodTypeIri)
			<${resourceIri}> wadl:hasMethod ?methodIri.
			?methodIri a ?methodTypeIri;
					wadl:hasRequest ?requestIri.
			?requestIri a wadl:Request.
			OPTIONAL {
				?requestIri wadl:hasParameter ?parameter.
				?parameter a wadl:Parameter;
					wadl:hasParameterName ?parameterName;
					wadl:hasParameterType ?parameterType.
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
		const mappedResult = this.converter.convertToDefinition(rawResult.results.bindings, requestMappingDefinition).getFirstRootElement() as Array<WadlRequest>;
		console.log(mappedResult);
		
		return mappedResult[0];
	}
}


const requestMappingDefinition: MappingDefinition[] = [{
	rootName: 'methodIri',
	propertyToGroup: 'methodIri',
	name: 'methodIri',
	toCollect: ['methodTypeIri'],
	childMappings: [{
		rootName: 'request',
		childMappings: [{
			rootName: 'parameter',
			toCollect: ['parameterName', 'parameterType']
		},
		{
			rootName: 'representation',
			childMappings: [{
				rootName: 'parameter',
				toCollect: ['parameterName', 'parameterType']
			}],
		}]
	},
	{
		rootName: 'responses',
		childMappings: [{
			rootName: 'parameter',
			toCollect: ['parameterName', 'parameterType']
		},
		{
			rootName: 'representation',
			childMappings: [{
				rootName: 'parameter',
				toCollect: ['parameterName', 'parameterType']
			}],
		}]
	}]
}];