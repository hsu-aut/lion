import {Namespace} from '../utils/prefixes';
const nsPrefix = `wadl`;
const nsUri = `http://www.hsu-ifa.de/ontologies/WADL#`;

var parser = new Namespace();

export class WADLDATA {

// Für Abfrage welche Methoden in der TBox vorhanden sind    
public availableMethods = `
PREFIX ${nsPrefix}: <${nsUri}>
SELECT DISTINCT ?availableMethods
WHERE { 
    ?availableMethods sesame:directSubClassOf ${nsPrefix}:Method . 
}
`;

// Abfrage welche Resources vorhanden sind (A-Box)
public availableResources = `
PREFIX ${nsPrefix}: <${nsUri}>

SELECT ?BaseUrl ?Resource 
WHERE { 
    ?Bas ${nsPrefix}:hasResource ?Res.
    ?Bas ${nsPrefix}:hasBase ?BaseUrl.
    ?Res ${nsPrefix}:hasPath ?Resource.
}
`;

public availableResourcesTemp = `
PREFIX WADL: <http://www.hsu-ifa.de/ontologies/WADL#>

SELECT ?BaseUrl ?Resource 
WHERE { 
    ?Bas WADL:hasResource ?Res.
    ?Bas WADL:hasBase ?BaseUrl.
    ?Res WADL:hasPath ?Resource.
}`;

public getAllParameters(graph:mandInfos){

};

public getQueryParameters(graph: mandInfos){
        var baseUrl = parser.parseToName(graph.baseUrl);
        var resourceName = parser.parseToIRI(graph.resourceName);
        var method = parser.parseToIRI(graph.method);
        var returnString = `
        PREFIX ${nsPrefix}: <${nsUri}>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?Key ?Type ?OptionValue 
    WHERE {
        <${nsUri}${baseUrl}${resourceName}> ${nsPrefix}:hasMethod ?Method.
        ?Method rdf:type ?MethodType.
        FILTER(?MethodType = ${nsPrefix}:${method})
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

public getQueryParametersTemp(graph: mandInfos){
    var baseUrl = parser.parseToName(graph.baseUrl);
    var resourceName = parser.parseToIRI(graph.resourceName);
    var method = parser.parseToIRI(graph.method);
    var returnString = `
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?Key ?Type ?OptionValue 
WHERE {
    <http://www.hsu-ifa.de/ontologies/WADL#${baseUrl}${resourceName}> wadl:hasMethod ?Method.
    ?Method rdf:type ?MethodType.
    FILTER(?MethodType = wadl:${method})
    ?Method wadl:hasRequest ?Request.    
    ?Request wadl:hasParameter ?Parameter.
    ?Parameter rdf:type ?ParameterType. VALUES ?ParameterType {wadl:QueryParameter}
    ?Parameter wadl:hasParameterName ?Key.
    Optional{?Parameter wadl:hasParameterType ?Type.}
    Optional{?Parameter wadl:hasParameterOption ?Option.
        Optional{?Option wadl:hasOptionValue ?OptionValue}
    }

}
`;
return returnString;
};

public getHeaderParamters(graph:mandInfos){
    var baseUrl = parser.parseToName(graph.baseUrl);
    var resourceName = parser.parseToIRI(graph.resourceName);
    var method = parser.parseToIRI(graph.method);
    var returnString = `
    PREFIX ${nsPrefix}: <${nsUri}>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?Parameter ?MediaType
    WHERE {
        <${nsUri}${baseUrl}${resourceName}> wadl:hasMethod ?Method.
        ?Method rdf:type ?MethodType.
        FILTER(?MethodType = wadl:${method})
        ?Method ${nsPrefix}:hasRequest ?Request.    
        ?Request ${nsPrefix}:hasParameter ?Parameter. 
        ?Parameter rdf:type ?ParameterType. VALUES ?ParameterType {${nsPrefix}:HeaderParameter}
        Optional{?Parameter ${nsPrefix}:hasRepresentation ?Rep.
            Optional{?rep ${nsPrefix}:hasMediaType ?MediaType}
        }
    }
    `;
    return returnString;
};
public getHeaderParamtersTemp(graph:mandInfos){
    var baseUrl = parser.parseToName(graph.baseUrl);
    var resourceName = parser.parseToIRI(graph.resourceName);
    var method = parser.parseToIRI(graph.method);
    var returnString = `
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?Parameter ?MediaType
    WHERE {
        <http://www.hsu-ifa.de/ontologies/WADL#${baseUrl}${resourceName}> wadl:hasMethod ?Method.
        ?Method rdf:type ?MethodType.
        FILTER(?MethodType = wadl:${method})
        ?Method wadl:hasRequest ?Request.    
        ?Request wadl:hasParameter ?Parameter. 
        ?Parameter rdf:type ?ParameterType. VALUES ?ParameterType {wadl:HeaderParameter}
        Optional{?Parameter wadl:hasRepresentation ?Rep.
            Optional{?rep wadl:hasMediaType ?MediaType}
        }
    }
    `;
    return returnString;
    
}


public getAllParamtersTemp(graph:mandInfos){
    var baseUrl = parser.parseToName(graph.baseUrl);
    var resourceName = parser.parseToIRI(graph.resourceName);
    var method = parser.parseToIRI(graph.method);
    var selectString = `
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?Type ?Key ?ParameterType ?OptionValue ?mediaType
    WHERE {
        <http://www.hsu-ifa.de/ontologies/WADL#${baseUrl}${resourceName}> wadl:hasMethod ?Method.
        ?Method rdf:type ?MethodType.
        FILTER(?MethodType = wadl:${method})
        ?Method wadl:hasRequest ?Request.    
        ?Request wadl:hasParameter ?Parameter.
        ?Parameter rdf:type ?Type. VALUES ?Type {wadl:QueryParameter wadl:HeaderParameter wadl:MatrixParameter wadl:PlainParameter wadl:TemplateParameter}
    Optional{?Parameter wadl:hasParameterName ?Key.}
        Optional{?Parameter wadl:hasParameterType ?ParameterType.}
        Optional{?Parameter wadl:hasParameterOption ?Option.
            Optional{?Option wadl:hasOptionValue ?OptionValue}
        }
    Optional{?Parameter wadl:hasRepresentation ?rep.
        Optional{
            ?rep wadl:hasMediaType ?mediaType.
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
        public createEntity(graph: mandInfos){
            var baseUrl = parser.parseToName(graph.baseUrl);
            var resourceName = parser.parseToIRI(graph.resourceName);
            var method = parser.parseToIRI(graph.method);    
            var insertString = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX ${nsPrefix}: <${nsUri}>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            INSERT { 
                ?resources rdf:type ${nsPrefix}:Resources; 
                a owl:NamedIndividual;
                ${nsPrefix}:hasBase ?base.
                
                ?resource rdf:type ${nsPrefix}:Resource; 
                a owl:NamedIndividual; 
                ${nsPrefix}:hasPath ?path. 
                
                ?method rdf:type ${nsPrefix}:${method};
                a owl:NamedIndividual.
                
                ?resources ${nsPrefix}:hasResource ?resource.
                ?resource ${nsPrefix}:hasMethod ?method.
                         
                    } WHERE {
                         BIND(STR("${nsUri}") AS ?Namespace).
                            BIND(STR("${baseUrl}") AS ?resources_name).
                            BIND(IRI(CONCAT(?Namespace, ?resources_name)) AS ?resources).
                            BIND(STR(?resources_name) AS ?base).
                
                            BIND(STR("${resourceName}") AS ?resource_name).
                              BIND(IRI(CONCAT(?Namespace, CONCAT(?resources_name, ?resource_name))) AS ?resource).
                             BIND(?resource_name AS ?path).
                
                            BIND(STR(CONCAT(?resources_name, ?resource_name, "_${method}" )) AS ?method_name).
                            BIND(IRI(CONCAT(?Namespace, ?method_name)) AS ?method).
                
                    }
            `;
            return insertString;
        };

        public createEntityTemp(graph: mandInfos){
            var baseUrl = parser.parseToName(graph.baseUrl);
            var resourceName = parser.parseToIRI(graph.resourceName);
            var method = parser.parseToIRI(graph.method);    
            var insertString = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX WADL: <http://www.hsu-ifa.de/ontologies/WADL#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            INSERT { 
                ?resources rdf:type WADL:Resources; 
                a owl:NamedIndividual;
                WADL:hasBase ?base.
                
                ?resource rdf:type WADL:Resource; 
                a owl:NamedIndividual; 
                WADL:hasPath ?path. 
                
                ?method rdf:type WADL:${method};
                a owl:NamedIndividual.
                
                ?resources WADL:hasResource ?resource.
                ?resource WADL:hasMethod ?method.
                         
                    } WHERE {
                         BIND(STR("http://www.hsu-ifa.de/ontologies/WADL#") AS ?Namespace).
                            BIND(STR("${baseUrl}") AS ?resources_name).
                            BIND(IRI(CONCAT(?Namespace, ?resources_name)) AS ?resources).
                            BIND(STR(?resources_name) AS ?base).
                
                            BIND(STR("${resourceName}") AS ?resource_name).
                              BIND(IRI(CONCAT(?Namespace, CONCAT(?resources_name, ?resource_name))) AS ?resource).
                             BIND(?resource_name AS ?path).
                
                            BIND(STR(CONCAT(?resources_name, ?resource_name, "_${method}" )) AS ?method_name).
                            BIND(IRI(CONCAT(?Namespace, ?method_name)) AS ?method).
                
                    }
            `;
            return insertString;
        };

        public createEntityWithModel(graph: mandInfos, modelIri: string){
                    var baseUrl = parser.parseToName(graph.baseUrl);
                    var resourceName = parser.parseToIRI(graph.resourceName);
                    var method = parser.parseToIRI(graph.method);
                    var modelIri = modelIri;    
                    var insertString = `
                    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                    PREFIX owl: <http://www.w3.org/2002/07/owl#>
                    PREFIX ${nsPrefix}: <${nsUri}>
                    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                    INSERT {
                        ${modelIri} ${nsPrefix}:hasService ?resources.
                        
                        ?resources rdf:type ${nsPrefix}:Resources; 
                        a owl:NamedIndividual;
                        ${nsPrefix}:hasBase ?base.
                        
                        ?resource rdf:type ${nsPrefix}:Resource; 
                        a owl:NamedIndividual; 
                        ${nsPrefix}:hasPath ?path. 
                        
                        ?method rdf:type ${nsPrefix}:${method};
                        a owl:NamedIndividual.
                        
                        ?resources ${nsPrefix}:hasResource ?resource.
                        ?resource ${nsPrefix}:hasMethod ?method.
                                 
                            } WHERE {
                                 BIND(STR("${nsUri}") AS ?Namespace).
                                    BIND(STR("${baseUrl}") AS ?resources_name).
                                    BIND(IRI(CONCAT(?Namespace, ?resources_name)) AS ?resources).
                                    BIND(STR(?resources_name) AS ?base).
                        
                                    BIND(STR("${resourceName}") AS ?resource_name).
                                      BIND(IRI(CONCAT(?Namespace, CONCAT(?resources_name, ?resource_name))) AS ?resource).
                                     BIND(?resource_name AS ?path).
                        
                                    BIND(STR(CONCAT(?resources_name, ?resource_name, "_${method}" )) AS ?method_name).
                                    BIND(IRI(CONCAT(?Namespace, ?method_name)) AS ?method).
                        
                            }
                    `;
                    return insertString;
        };

        public createQueryParameter(graph: mandInfos, paramInfo: parameterInfo){
            var baseUrl = parser.parseToName(graph.baseUrl);
            var resourceName = parser.parseToIRI(graph.resourceName);
            var method = parser.parseToIRI(graph.method);
    
            var parameterName = paramInfo.paramName;
            var parameterType = paramInfo.paramType;
            var optionValue = paramInfo.optionValue;
    
            var insertString = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX ${nsPrefix}: <${nsUri}>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            INSERT { 
                ?method rdf:type ${nsPrefix}:${method};
                a owl:NamedIndividual.
    
                ?request rdf:type ${nsPrefix}:Request; 
                a owl:NamedIndividual. 
    
                ?parameter rdf:type ${nsPrefix}:QueryParameter;
                a owl:NamedIndividual; 
                ${nsPrefix}:hasParameterName ?parameter_name;
                ${nsPrefix}:hasParameterType ?parameter_type.

                ?option rdf:type ${nsPrefix}:Option;
                a owl:NamedIndividual;
                ${nsPrefix}:hasOptionValue ?option_value.
                
                ?method ${nsPrefix}:hasRequest ?request. 
                ?request ${nsPrefix}:hasParameter ?parameter.
                ?parameter ${nsPrefix}:hasParameterOption ?option.

                    } WHERE {
                            BIND(STR("${nsUri}") AS ?Namespace).
                
                            BIND(STR(CONCAT("${baseUrl}", "${resourceName}", "_${method}")) AS ?method_name).
                            BIND(IRI(CONCAT(?Namespace, ?method_name)) AS ?method).

                            BIND(STR(CONCAT(?method_name, "_Req")) AS ?request_name).
                            BIND(IRI(CONCAT(?Namespace, ?request_name)) AS ?request).

                            BIND(STR("${parameterType}") AS ?parameter_type).
                            BIND(STR("${parameterName}") AS ?parameter_name).
                            BIND(IRI(CONCAT(?Namespace, ?request_name, "_", ?parameter_name)) AS ?parameter).

                            BIND(STR(CONCAT(?request_name, "_", ?parameter_name, "_Option")) AS ?option_name).
                            BIND(IRI(CONCAT(?Namespace, ?option_name)) AS ?option).

                            BIND(STR("${optionValue}") as ?option_value)
                
                    }
            `;
            return insertString;
        };    

        public createHeaderParameter(graph: mandInfos, mediaType: string){
            var baseUrl = parser.parseToName(graph.baseUrl);
            var resourceName = parser.parseToIRI(graph.resourceName);
            var method = parser.parseToIRI(graph.method);
    
            var mediaType = mediaType;
    
            var insertString = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX ${nsPrefix}: <${nsUri}>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            INSERT { 
                ?method rdf:type ${nsPrefix}:${method};
                a owl:NamedIndividual.
    
                ?request rdf:type ${nsPrefix}:Request; 
                a owl:NamedIndividual. 
    
                ?parameter rdf:type ${nsPrefix}:HeaderParameter;
                a owl:NamedIndividual.

                ?representation rdf:type ${nsPrefix}:Representation;
                a owl:NamedIndividual;
                ${nsPrefix}:hasMediaType ?mediaType.
                
                ?method ${nsPrefix}:hasRequest ?request. 
                ?request ${nsPrefix}:hasParameter ?parameter.
                ?parameter ${nsPrefix}:hasRepresentation ?representation.

                    } WHERE {
                            BIND(STR("${nsUri}") AS ?Namespace).
                
                            BIND(STR(CONCAT("${baseUrl}", "${resourceName}", "_${method}")) AS ?method_name).
                            BIND(IRI(CONCAT(?Namespace, ?method_name)) AS ?method).

                            BIND(STR(CONCAT(?method_name, "_Req")) AS ?request_name).
                            BIND(IRI(CONCAT(?Namespace, ?request_name)) AS ?request).

                            BIND(STR(CONCAT(?request_name, "_Head")) AS ?parameter_name).
                            BIND(IRI(CONCAT(?Namespace, ?parameter_name)) AS ?parameter).

                            BIND(STR(CONCAT(?parameter_name, "_Rep")) AS ?representation_name).
                            BIND(IRI(CONCAT(?Namespace, ?representation_name)) AS ?representation).

                            BIND(STR("${mediaType}") as ?mediaType)
                
                    }
            `;
            return insertString;
        };
    
}