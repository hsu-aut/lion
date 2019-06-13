import { Namespace } from '../utils/prefixes';
import { PrefixesService } from '../rdf-models/services/prefixes.service';
const nsPrefix = `wadl`;
const nsUri = `http://www.hsu-ifa.de/ontologies/WADL#`;

var prefixService = new PrefixesService();
var activeNamespace = prefixService.getPrefixes()[prefixService.getActiveNamespace()];
var parser = new Namespace();

export class WADLDATA {
    // Temporär -> Sollte in den eigenen Modellen hinterlegt sein
    public getTechnicalResources = `
PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?TechnicalResource WHERE { 
	?TechnicalResource a VDI3682:TechnicalResource.
}
`;

    public getStructureElements = `
    PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
    SELECT DISTINCT ?Element ?EntityType WHERE { 
        ?Element a ?EntityType.
        VALUES ?EntityType { VDI2206:FunctionalUnit VDI2206:System VDI2206:BasicSystem VDI2206:Module VDI2206:Energy VDI2206:Information VDI2206:Product VDI2206:Actuator VDI2206:Sensor  VDI2206:Component}.
    }
    
`;


    // Für Abfrage welche Methoden in der TBox vorhanden sind    
    public availableMethods = `
PREFIX ${nsPrefix}: <${nsUri}>
SELECT DISTINCT ?availableMethods
WHERE { 
    ?availableMethods sesame:directSubClassOf ${nsPrefix}:Method. 
}
`;

    // Abfrage welche Resources vorhanden sind (A-Box)
    public availableResources = `
PREFIX ${nsPrefix}: <${nsUri}>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?BaseUrl ?Resource ?Method ?ServiceProvider 
WHERE { 
    ?Bas ${nsPrefix}:hasResource ?Res.
    ?Bas ${nsPrefix}:hasBase ?BaseUrl.
    ?Res ${nsPrefix}:hasPath ?Resource.
    ?Res ${nsPrefix}:hasMethod ?Met.
    ?Met rdf:type ?Method.
    FILTER(?Method = ${nsPrefix}:GET || ?Method = ${nsPrefix}:POST || ?Method = ${nsPrefix}:DELETE || ?Method = ${nsPrefix}:POST ||?Method = ${nsPrefix}:HEAD ||?Method = ${nsPrefix}:PATCH ||?Method = ${nsPrefix}:PUT)
    OPTIONAL{?ServiceProvider ${nsPrefix}:hasService ?Bas.}    
}`;

    public checkIfMethodExists(graph: mandInfos) {
        var returnString = `    
    PREFIX ${nsPrefix}: <${nsUri}>
    ASK {
            <${activeNamespace.namespace}${graph.baseUrl}${graph.resourceName}> ${nsPrefix}:hasMethod ?Method.
            ?Method rdf:type ?MethodType.
            FILTER(?MethodType = ${nsPrefix}:${graph.method})
        }`;
        console.log(returnString);
        return returnString;
    };

    public getQueryParameters(graph: mandInfos) {
        var returnString = `
        PREFIX ${nsPrefix}: <${nsUri}>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ${activeNamespace.prefix} <${activeNamespace.namespace}>
SELECT ?Key ?Type ?OptionValue 
    WHERE {
        <${activeNamespace.namespace}${graph.baseUrl}${graph.resourceName}> ${nsPrefix}:hasMethod ?Method.
        ?Method rdf:type ?MethodType.
        FILTER(?MethodType = ${nsPrefix}:${graph.method})
        ?Method ${nsPrefix}:hasRequest ?Request.    
        ?Request ${nsPrefix}:hasParameter ?Parameter.
        ?Parameter rdf:type ?ParameterType. VALUES ?ParameterType {${nsPrefix}:QueryParameter}
    	?Parameter ${nsPrefix}:hasParameterName ?Key.
        Optional{?Parameter ${nsPrefix}:hasParameterType ?Type.}
        Optional{?Parameter ${nsPrefix}:hasParameterOption ?Option.
            Optional{?Option ${nsPrefix}:hasOptionValue ?OptionValue}
        }
    }
    `;
        return returnString;
    };


    public getHeaderParameters(graph: mandInfos) {
        var baseUrl = parser.parseToName(graph.baseUrl);
        var resourceName = parser.parseToIRI(graph.resourceName);
        var method = parser.parseToIRI(graph.method);
        var returnString = `
    PREFIX ${nsPrefix}: <${nsUri}>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?Key ?MediaType
    WHERE {
        <${activeNamespace.namespace}${baseUrl}${resourceName}> wadl:hasMethod ?Method.
        ?Method rdf:type ?MethodType.
        FILTER(?MethodType = wadl:${method})
        ?Method ${nsPrefix}:hasRequest ?Request.    
        ?Request ${nsPrefix}:hasParameter ?Parameter. 
        ?Parameter rdf:type ?ParameterType. VALUES ?ParameterType {${nsPrefix}:HeaderParameter}
        Optional{?Parameter ${nsPrefix}:hasParameterName ?Key.
        Optional{?Parameter ${nsPrefix}:hasRepresentation ?Rep.
        Optional{?Rep ${nsPrefix}:hasMediaType ?MediaType}}
        }
    }
    `;
        console.log(returnString);
        return returnString;
    };


    public getAllParameters(graph: mandInfos) {
        var selectString = `
    PREFIX ${nsPrefix}: <${nsUri}>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX ${activeNamespace.prefix} <${activeNamespace.namespace}>
SELECT ?Type ?Key ?ParameterType ?OptionValue ?mediaType
    WHERE {
        <${activeNamespace.namespace}${graph.baseUrl}${graph.resourceName}> ${nsPrefix}:hasMethod ?Method.
        ?Method rdf:type ?MethodType.
        FILTER(?MethodType = ${nsPrefix}:${graph.method})
        ?Method ${nsPrefix}:hasRequest ?Request.    
        ?Request ${nsPrefix}:hasParameter ?Parameter.
        ?Parameter rdf:type ?Type. VALUES ?Type {${nsPrefix}:QueryParameter ${nsPrefix}:HeaderParameter ${nsPrefix}:MatrixParameter ${nsPrefix}:PlainParameter ${nsPrefix}:TemplateParameter}
    Optional{?Parameter ${nsPrefix}:hasParameterName ?Key.}
        Optional{?Parameter ${nsPrefix}:hasParameterType ?ParameterType.}
        Optional{?Parameter ${nsPrefix}:hasParameterOption ?Option.
            Optional{?Option ${nsPrefix}:hasOptionValue ?OptionValue}
        }
    Optional{?Parameter ${nsPrefix}:hasRepresentation ?rep.
        Optional{
            ?rep ${nsPrefix}:hasMediaType ?mediaType.
        }}
    }
    `;
        return selectString;

    }

}

export class mandInfos {
    baseUrl: string;
    resourceName: string;
    method: string;
}
export class parameterInfo {
    paramName: string;
    paramType: string;
    optionValue: string;
}

export class WADLVARIABLES {
    mandatoryInformations: mandInfos;
    parameterInfo: parameterInfo;

}

export class WADLINSERT {
    // Anlegen einer Resource bis zur Methode
    public createEntity(graph: mandInfos) {
        var insertString = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX ${nsPrefix}: <${nsUri}>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX ${activeNamespace.prefix} <${activeNamespace.namespace}>
            INSERT { 
                ?resources rdf:type ${nsPrefix}:Resources; 
                a owl:NamedIndividual;
                ${nsPrefix}:hasBase "${graph.baseUrl}"^^xsd:anyURI.
                
                ?resource rdf:type ${nsPrefix}:Resource; 
                a owl:NamedIndividual; 
                ${nsPrefix}:hasPath ?path. 
                
                ?method rdf:type ${nsPrefix}:${graph.method};
                a owl:NamedIndividual.
                
                ?resources ${nsPrefix}:hasResource ?resource.
                ?resource ${nsPrefix}:hasMethod ?method.
                         
                    } WHERE {
                         BIND(STR("${activeNamespace.namespace}") AS ?Namespace).
                            BIND(STR("${graph.baseUrl}") AS ?resources_name).
                            BIND(IRI(CONCAT(?Namespace, ?resources_name)) AS ?resources).
                            BIND(STR(?resources_name) AS ?base).
                
                            BIND(STR("${graph.resourceName}") AS ?resource_name).
                              BIND(IRI(CONCAT(?Namespace, CONCAT(?resources_name, ?resource_name))) AS ?resource).
                             BIND(?resource_name AS ?path).
                
                            BIND(STR(CONCAT(?resources_name, ?resource_name, "_${graph.method}" )) AS ?method_name).
                            BIND(IRI(CONCAT(?Namespace, ?method_name)) AS ?method).
                
                    }
            `;
        return insertString;
    };

    public createEntityWithModel(graph: mandInfos, modelIri: string) {
        var modelIri = modelIri;
        var insertString = `
                    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                    PREFIX owl: <http://www.w3.org/2002/07/owl#>
                    PREFIX ${nsPrefix}: <${nsUri}>
                    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                    PREFIX ${activeNamespace.prefix} <${activeNamespace.namespace}>
                    INSERT {
                        <${modelIri}> ${nsPrefix}:hasService ?resources.
                        
                        ?resources rdf:type ${nsPrefix}:Resources; 
                        a owl:NamedIndividual;
                        ${nsPrefix}:hasBase "${graph.baseUrl}"^^xsd:anyURI.
                        
                        ?resource rdf:type ${nsPrefix}:Resource; 
                        a owl:NamedIndividual; 
                        ${nsPrefix}:hasPath ?path. 
                        
                        ?method rdf:type ${nsPrefix}:${graph.method};
                        a owl:NamedIndividual.
                        
                        ?resources ${nsPrefix}:hasResource ?resource.
                        ?resource ${nsPrefix}:hasMethod ?method.
                                 
                            } WHERE {
                                 BIND(STR("${activeNamespace.namespace}") AS ?Namespace).
                                    BIND(STR("${graph.baseUrl}") AS ?resources_name).
                                    BIND(IRI(CONCAT(?Namespace, ?resources_name)) AS ?resources).
                                    BIND(STR(?resources_name) AS ?base).
                        
                                    BIND(STR("${graph.resourceName}") AS ?resource_name).
                                      BIND(IRI(CONCAT(?Namespace, CONCAT(?resources_name, ?resource_name))) AS ?resource).
                                     BIND(?resource_name AS ?path).
                        
                                    BIND(STR(CONCAT(?resources_name, ?resource_name, "_${graph.method}" )) AS ?method_name).
                                    BIND(IRI(CONCAT(?Namespace, ?method_name)) AS ?method).
                        
                            }
                    `;
        return insertString;
    };

    public createQueryParameter(graph: mandInfos, paramInfo: parameterInfo) {
        var insertString = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX ${nsPrefix}: <${nsUri}>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX ${activeNamespace.prefix} <${activeNamespace.namespace}>
            INSERT { 
                ?method rdf:type ${nsPrefix}:${graph.method};
                a owl:NamedIndividual.
    
                ?request rdf:type ${nsPrefix}:Request; 
                a owl:NamedIndividual. 
    
                ?parameter rdf:type ${nsPrefix}:QueryParameter;
                a owl:NamedIndividual; 
                ${nsPrefix}:hasParameterName "${paramInfo.paramName}"^^xsd:NMTOKEN;
                ${nsPrefix}:hasParameterType ?parameter_type.
                ?option rdf:type ${nsPrefix}:Option;
                a owl:NamedIndividual;
                ${nsPrefix}:hasOptionValue ?option_value.
                
                ?method ${nsPrefix}:hasRequest ?request. 
                ?request ${nsPrefix}:hasParameter ?parameter.
                ?parameter ${nsPrefix}:hasParameterOption ?option.
                    } WHERE {
                            BIND(STR("${activeNamespace.namespace}") AS ?Namespace).
                
                            BIND(STR(CONCAT("${graph.baseUrl}", "${graph.resourceName}", "_${graph.method}")) AS ?method_name).
                            BIND(IRI(CONCAT(?Namespace, ?method_name)) AS ?method).
                            BIND(STR(CONCAT(?method_name, "_Req")) AS ?request_name).
                            BIND(IRI(CONCAT(?Namespace, ?request_name)) AS ?request).
                            BIND(STR("${paramInfo.paramType}") AS ?parameter_type).
                            BIND(STR("${paramInfo.paramName}") AS ?parameter_name).
                            BIND(IRI(CONCAT(?Namespace, ?request_name, "_", ?parameter_name)) AS ?parameter).
                            BIND(STR(CONCAT(?request_name, "_", ?parameter_name, "_Option")) AS ?option_name).
                            BIND(IRI(CONCAT(?Namespace, ?option_name)) AS ?option).
                            BIND(STR("${paramInfo.optionValue}") as ?option_value)
                
                    }
            `;
        return insertString;
    };

    public createHeaderParameter(graph: mandInfos, headerKey: string, mediaType: string) {
        var insertString = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX ${nsPrefix}: <${nsUri}>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX ${activeNamespace.prefix} <${activeNamespace.namespace}>
            INSERT { 
                ?method rdf:type ${nsPrefix}:${graph.method};
                a owl:NamedIndividual.
    
                ?request rdf:type ${nsPrefix}:Request; 
                a owl:NamedIndividual. 
    
                ?parameter rdf:type ${nsPrefix}:HeaderParameter;
                a owl:NamedIndividual;
                ${nsPrefix}:hasParameterName "${headerKey}"^^xsd:NMTOKEN.
                ?representation rdf:type ${nsPrefix}:Representation;
                a owl:NamedIndividual;
                ${nsPrefix}:hasMediaType "${mediaType}"^^rdfs:Literal.
                
                ?method ${nsPrefix}:hasRequest ?request. 
                ?request ${nsPrefix}:hasParameter ?parameter.
                ?parameter ${nsPrefix}:hasRepresentation ?representation.
                    } WHERE {
                            BIND(STR("${activeNamespace.namespace}") AS ?Namespace).
                
                            BIND(STR(CONCAT("${graph.baseUrl}", "${graph.resourceName}", "_${graph.method}")) AS ?method_name).
                            BIND(IRI(CONCAT(?Namespace, ?method_name)) AS ?method).
                            BIND(STR(CONCAT(?method_name, "_Req")) AS ?request_name).
                            BIND(IRI(CONCAT(?Namespace, ?request_name)) AS ?request).
                            BIND(STR(CONCAT(?request_name, "_Head_${headerKey}")) AS ?parameter_name).
                            BIND(IRI(CONCAT(?Namespace, ?parameter_name)) AS ?parameter).
                            BIND(STR(CONCAT(?parameter_name, "_Rep")) AS ?representation_name).
                            BIND(IRI(CONCAT(?Namespace, ?representation_name)) AS ?representation).                
                    }
            `;
        return insertString;
    };

    public deleteServiceProvider(baseUrl: string, serviceProvider: string) {
        if (serviceProvider.search(activeNamespace.prefix) == -1) {
            var deleteString = `			
                PREFIX ${nsPrefix}: <${nsUri}>
                PREFIX ${activeNamespace.prefix} <${activeNamespace.namespace}>
                DELETE WHERE {
                <${serviceProvider}> ${nsPrefix}:hasService ${activeNamespace.prefix}${baseUrl}.
                }
                `;
        } else {
            var deleteString = `			
                PREFIX ${nsPrefix}: <${nsUri}>
                PREFIX ${activeNamespace.prefix} <${activeNamespace.namespace}>
                DELETE WHERE {
                ${serviceProvider} ${nsPrefix}:hasService ${activeNamespace.prefix}${baseUrl}.
                }
                `;
        }

        console.log(deleteString);
        return deleteString;
    }

    public deleteQueryParameter(graph: mandInfos, paramInfo: parameterInfo) {
        var deleteString = `
            PREFIX ${nsPrefix}: <${nsUri}>
            PREFIX ${activeNamespace.prefix} <${activeNamespace.namespace}>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            
            DELETE WHERE {
                    <${activeNamespace.namespace}${graph.baseUrl}${graph.resourceName}_${graph.method}_Req_${paramInfo.paramName}> rdf:type ${nsPrefix}:QueryParameter;
                            a owl:NamedIndividual;
                            ${nsPrefix}:hasParameterName ?name;
                            ${nsPrefix}:hasParameterType ?type;
                            ${nsPrefix}:hasParameterOption ?option.
                            ?option rdf:type ${nsPrefix}:Option;
                            a owl:NamedIndividual;
                            ${nsPrefix}:hasOptionValue ?value.
                        };
            
            DELETE WHERE {
                <${activeNamespace.namespace}${graph.baseUrl}${graph.resourceName}_${graph.method}_Req_${paramInfo.paramName}> rdf:type ${nsPrefix}:QueryParameter;
                            a owl:NamedIndividual;
                            ${nsPrefix}:hasParameterName ?name;
                            ${nsPrefix}:hasParameterOption ?option.
                            ?option rdf:type ${nsPrefix}:Option;
                            a owl:NamedIndividual;
                            ${nsPrefix}:hasOptionValue ?value.
                        };
            DELETE WHERE {
                <${activeNamespace.namespace}${graph.baseUrl}${graph.resourceName}_${graph.method}_Req_${paramInfo.paramName}> rdf:type ${nsPrefix}:QueryParameter;
                            a owl:NamedIndividual;
                            ${nsPrefix}:hasParameterName ?name;
                            ${nsPrefix}:hasParameterOption ?option.
                            ?option rdf:type ${nsPrefix}:Option;
                            a owl:NamedIndividual;
                        };
            `;
        console.log(deleteString);
        return deleteString;
    };

    public deleteQueryOptionValue(graph: mandInfos, paramInfo: parameterInfo) {
        var deleteString = `
            PREFIX ${nsPrefix}: <${nsUri}>
            PREFIX ${activeNamespace.prefix} <${activeNamespace.namespace}>
            DELETE WHERE { 
                 <${activeNamespace.namespace}${graph.baseUrl}${graph.resourceName}_${graph.method}_Req_${paramInfo.paramName}_Option> ${nsPrefix}:hasOptionValue "${paramInfo.optionValue}";
            }
            `;
        console.log(deleteString);
        return deleteString;
    };

    public deleteQueryParameterType(graph: mandInfos, paramInfo: parameterInfo) {
        var deleteString = `
            PREFIX ${nsPrefix}: <${nsUri}>
            PREFIX ${activeNamespace.prefix} <${activeNamespace.namespace}>
            DELETE WHERE { 
                 <${activeNamespace.namespace}${graph.baseUrl}${graph.resourceName}_${graph.method}_Req_${paramInfo.paramName}> ${nsPrefix}:hasParameterType "${paramInfo.paramType}";
            }
            `;
        console.log(deleteString);
        return deleteString;
    };

    public deleteHeaderParameter(graph: mandInfos, paramInfo: parameterInfo) {
        var deleteString = `
            PREFIX ${nsPrefix}: <${nsUri}>
            PREFIX ${activeNamespace.prefix} <${activeNamespace.namespace}>
            DELETE WHERE {
                <${activeNamespace.namespace}${graph.baseUrl}${graph.resourceName}_${graph.method}_Req_Head_${paramInfo.paramName}> rdf:type ${nsPrefix}:HeaderParameter;
                a owl:NamedIndividual;
                ${nsPrefix}:hasParameterName "${paramInfo.paramName}"^^xsd:NMTOKEN;
        		${nsPrefix}:hasRepresentation ?rep.
    			
    			?rep rdf:type ${nsPrefix}:Representation;
       			a owl:NamedIndividual;
                ${nsPrefix}:hasMediaType "${paramInfo.paramType}"^^rdfs:Literal.
			}
            `;
        console.log(deleteString);
        return deleteString;
    }








}