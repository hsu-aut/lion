import { Injectable } from '@angular/core';
import { PrefixesService } from './services/prefixes.service';
import { SparqlQueriesService } from './services/sparql-queries.service';
import { DataLoaderService } from '../../../shared/services/dataLoader.service';
import { take } from 'rxjs/operators';
import { keyframes } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class WadlModelService {
  wadlData = new WADLDATA();
  wadlInsert = new WADLINSERT();

  private LIST_OF_METHODS = [];
  private TABLE_OF_RESOURCES = [];

  constructor(
    private query: SparqlQueriesService,
    private nameService: PrefixesService,
    private loadingScreenService: DataLoaderService
  ) {
    this.initializeWADL();
  }

  public initializeWADL() {
    this.loadLIST_OF_METHODS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      for (let x in data) {
        this.LIST_OF_METHODS[x] = this.nameService.parseToName(data[x]);
      }
    });

    this.loadTABLE_OF_RESOURCES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      for (let x = 0; x < data.length; x++) {
        data[x].Method = this.nameService.parseToName(data[x].Method);
       
      }
      this.TABLE_OF_RESOURCES = data;
    });
  }

  // loader

  public loadLIST_OF_METHODS() {
    this.loadingScreenService.startLoading();
    return this.query.selectList(this.wadlData.SELECT_LIST_OF_METHODS, 0);
  }

  public loadTABLE_OF_RESOURCES() {
    this.loadingScreenService.startLoading();
    return this.query.selectTable(this.wadlData.SELECT_TABLE_OF_RESOURCES);
  }

  public reloadTABLE_OF_RESOURCES() {
    this.loadTABLE_OF_RESOURCES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.TABLE_OF_RESOURCES = data;
      for (let x = 0; x < data.length; x++) {
        this.TABLE_OF_RESOURCES[x].Method = this.nameService.parseToName(this.TABLE_OF_RESOURCES[x].Method);
      }
    });
    return this.TABLE_OF_RESOURCES;
  }

  public loadASK_METHOD_EXISTS(graph: mandInfos) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;
    this.loadingScreenService.startLoading();
    return this.query.select(this.wadlData.ASK_METHOD_EXISTS(activeNamespace, graph));
  }

  public loadTABLE_OF_PARAMETERS(parameterType: string, graph: mandInfos){
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;
    this.loadingScreenService.startLoading();
    if(parameterType === 'all'){
      return this.query.selectTable(this.wadlData.SELECT_TABLE_OF_ALL_PARAMETERS(activeNamespace, graph));
    }
    if(parameterType === 'header'){
      return this.query.selectTable(this.wadlData.SELECT_TABLE_OF_HEADER_PARAMETERS(activeNamespace, graph));
    }
    if(parameterType === 'query'){
      return this.query.selectTable(this.wadlData.SELECT_TABLE_OF_QUERY_PARAMETERS(activeNamespace, graph));
    }

  }

  public setTABLE_OF_RESOURCES(table){
    this.TABLE_OF_RESOURCES = table;
  };


  public getLIST_OF_METHODS() {
    return this.LIST_OF_METHODS;
  }

  public getTABLE_OF_RESOURCES() {
    return this.TABLE_OF_RESOURCES;
  }

  public insertCreateEntity(graph: mandInfos) {
    this.loadingScreenService.startLoading();
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

    var GRAPHS = this.nameService.getGraphs();
    var activeGraph = GRAPHS[this.nameService.getActiveGraph()];
    return this.query.insert(this.wadlInsert.createEntity(activeGraph, activeNamespace, graph));
  }

  public buildCreateEntity(graph: mandInfos) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

    var GRAPHS = this.nameService.getGraphs();
    var activeGraph = GRAPHS[this.nameService.getActiveGraph()];
    return this.wadlInsert.createEntity(activeGraph, activeNamespace, graph);
  }

  public insertCreateEntityWithModel(graph: mandInfos, modelIri: String) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

    var GRAPHS = this.nameService.getGraphs();
    var activeGraph = GRAPHS[this.nameService.getActiveGraph()];
    return this.query.insert(this.wadlInsert.createEntityWithModel(activeGraph, activeNamespace, graph, modelIri));
  }

  public buildCreateEntityWithModel(graph: mandInfos, modelIri: String) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

    var GRAPHS = this.nameService.getGraphs();
    var activeGraph = GRAPHS[this.nameService.getActiveGraph()];
    return this.wadlInsert.createEntityWithModel(activeGraph, activeNamespace, graph, modelIri);
  }

  public insertCreateQueryParameter(graph: mandInfos, paramInfo: parameterInfo) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

    var GRAPHS = this.nameService.getGraphs();
    var activeGraph = GRAPHS[this.nameService.getActiveGraph()];
    return this.query.insert(this.wadlInsert.createQueryParameter(activeGraph, activeNamespace, graph, paramInfo));
  }

  public buildCreateQueryParameter(graph: mandInfos, paramInfo: parameterInfo) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

    var GRAPHS = this.nameService.getGraphs();
    var activeGraph = GRAPHS[this.nameService.getActiveGraph()];
    return this.wadlInsert.createQueryParameter(activeGraph, activeNamespace, graph, paramInfo);
  }

  public insertCreateHeaderParameter(graph: mandInfos, headerInfo: headerInfo) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

    var GRAPHS = this.nameService.getGraphs();
    var activeGraph = GRAPHS[this.nameService.getActiveGraph()];
    return this.query.insert(this.wadlInsert.createHeaderParameter(activeGraph, activeNamespace, graph, headerInfo));
  }
  public buildCreateHeaderParameter(graph: mandInfos, headerInfo: headerInfo) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

    var GRAPHS = this.nameService.getGraphs();
    var activeGraph = GRAPHS[this.nameService.getActiveGraph()];
    return this.wadlInsert.createHeaderParameter(activeGraph, activeNamespace, graph, headerInfo);
  }


  public deleteServiceProvider(baseUrl: string, serviceProvider: string) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;
    if (serviceProvider.search("http://") != -1) {
      serviceProvider = serviceProvider;
    } else if (serviceProvider.search(":") != -1) {
      serviceProvider = this.nameService.parseToIRI(serviceProvider);
    } else {
      serviceProvider = activeNamespace + serviceProvider;
    }
    baseUrl = activeNamespace + baseUrl;
    return this.query.insert(this.wadlInsert.deleteServiceProvider(baseUrl, serviceProvider));
  }

  public deleteQueryParameter(graph: mandInfos, paramInfo: parameterInfo) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;
    return this.query.insert(this.wadlInsert.deleteQueryParameter(activeNamespace, graph, paramInfo));
  };

  public deleteQueryOptionValue(graph: mandInfos, paramInfo: parameterInfo) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;
    return this.query.insert(this.wadlInsert.deleteQueryOptionValue(activeNamespace, graph, paramInfo));
  }

  public deleteQueryParameterType(graph: mandInfos, paramInfo: parameterInfo) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;
    return this.query.insert(this.wadlInsert.deleteQueryParameterType(activeNamespace, graph, paramInfo));
  }

  public deleteHeaderParameter(graph: mandInfos, headerInfo: headerInfo) {
    var PREFIXES = this.nameService.getPrefixes();
    var activeNamespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;
    return this.query.insert(this.wadlInsert.deleteHeaderParameter(activeNamespace, graph, headerInfo));
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

export class headerInfo {
  key: string;
  mediaType: string;
}

export class WADLVARIABLES {
  mandatoryInformations: mandInfos;
  parameterInfo: parameterInfo;
  headerInformations: headerInfo;
}



export class WADLDATA {
  // Temporär -> Sollte in den eigenen Modellen hinterlegt sein
  /*
  public getTechnicalResources = `
PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT ?TechnicalResource WHERE { 
?TechnicalResource a VDI3682:TechnicalResource.
}
`;*/

  public getStructureElements = `
  PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
  SELECT DISTINCT ?Element ?EntityType WHERE { 
      ?Element a ?EntityType.
      VALUES ?EntityType { VDI2206:FunctionalUnit VDI2206:System VDI2206:BasicSystem VDI2206:Module VDI2206:Energy VDI2206:Information VDI2206:Product VDI2206:Actuator VDI2206:Sensor  VDI2206:Component}.
  }
  
`;


  public ASK_METHOD_EXISTS(activeNamespace: String, graph: mandInfos) {
    var returnString = `    
PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>

ASK {
        <${activeNamespace}${graph.baseUrl}${graph.resourceName}> wadl:hasMethod ?Method.
        ?Method rdf:type ?MethodType.
        FILTER(?MethodType = wadl:${graph.method})
    }`;
    return returnString;
  };

  public SELECT_LIST_OF_METHODS = `
PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
SELECT DISTINCT ?availableMethods
WHERE { 
  ?availableMethods sesame:directSubClassOf wadl:Method. 
}
`;

  public SELECT_TABLE_OF_RESOURCES = `
PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?BaseUrl ?Resource ?Method ?ServiceProvider 
WHERE { 
  ?Bas wadl:hasResource ?Res.
  ?Bas wadl:hasBase ?BaseUrl.
  ?Res wadl:hasPath ?Resource.
  ?Res wadl:hasMethod ?Met.
  ?Met rdf:type ?Method.
  FILTER(?Method = wadl:GET || ?Method = wadl:POST || ?Method = wadl:DELETE || ?Method = wadl:POST ||?Method = wadl:HEAD ||?Method = wadl:PATCH ||?Method = wadl:PUT)
  OPTIONAL{?ServiceProvider wadl:hasService ?Bas.}    
}`;

  public SELECT_TABLE_OF_QUERY_PARAMETERS(activeNamespace: String, graph: mandInfos) {
    var selectString = `
      PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?Key ?Type ?OptionValue 
  WHERE {
      <${activeNamespace}${graph.baseUrl}${graph.resourceName}> wadl:hasMethod ?Method.
      ?Method rdf:type ?MethodType.
      FILTER(?MethodType = wadl:${graph.method})
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
    return selectString;
  }
  public SELECT_TABLE_OF_HEADER_PARAMETERS(activeNamespace: String, graph: mandInfos) {
    var selectString = `
  PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?Key ?MediaType
  WHERE {
      <${activeNamespace}${graph.baseUrl}${graph.resourceName}> wadl:hasMethod ?Method.
      ?Method rdf:type ?MethodType.
      FILTER(?MethodType = wadl:${graph.method})
      ?Method wadl:hasRequest ?Request.    
      ?Request wadl:hasParameter ?Parameter. 
      ?Parameter rdf:type ?ParameterType. VALUES ?ParameterType {wadl:HeaderParameter}
      Optional{?Parameter wadl:hasParameterName ?Key.
      Optional{?Parameter wadl:hasRepresentation ?Rep.
      Optional{?Rep wadl:hasMediaType ?MediaType}}

      }
  }
  `;
    return selectString;
  }
  public SELECT_TABLE_OF_ALL_PARAMETERS(activeNamespace: String, graph: mandInfos) {
    var selectString = `
  PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?Type ?Key ?ParameterType ?OptionValue ?mediaType
  WHERE {
      <${activeNamespace}${graph.baseUrl}${graph.resourceName}> wadl:hasMethod ?Method.
      ?Method rdf:type ?MethodType.
      FILTER(?MethodType = wadl:${graph.method})
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


export class WADLINSERT {
  public createEntity(activeGraph, activeNamespace: String, graph: mandInfos) {
    var insertString = `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX owl: <http://www.w3.org/2002/07/owl#>
          PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
          INSERT { GRAPH <${activeGraph}> {
              ?resources rdf:type wadl:Resources; 
              a owl:NamedIndividual;
              wadl:hasBase "${graph.baseUrl}"^^xsd:anyURI.
              
              ?resource rdf:type wadl:Resource; 
              a owl:NamedIndividual; 
              wadl:hasPath ?path. 
              
              ?method rdf:type wadl:${graph.method};
              a owl:NamedIndividual.
              
              ?resources wadl:hasResource ?resource.
              ?resource wadl:hasMethod ?method.}
                       
                  } WHERE {
                       BIND(STR("${activeNamespace}") AS ?Namespace).
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

  public createEntityWithModel(activeGraph, activeNamespace: String, graph: mandInfos, modelIri: String) {
    var insertString = `
                  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                  PREFIX owl: <http://www.w3.org/2002/07/owl#>
                  PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
                  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                  INSERT { GRAPH <${activeGraph}> {
                      <${modelIri}> wadl:hasService ?resources.
                      
                      ?resources rdf:type wadl:Resources; 
                      a owl:NamedIndividual;
                      wadl:hasBase "${graph.baseUrl}"^^xsd:anyURI.
                      
                      ?resource rdf:type wadl:Resource; 
                      a owl:NamedIndividual; 
                      wadl:hasPath ?path. 
                      
                      ?method rdf:type wadl:${graph.method};
                      a owl:NamedIndividual.
                      
                      ?resources wadl:hasResource ?resource.
                      ?resource wadl:hasMethod ?method.}
                               
                          } WHERE {
                               BIND(STR("${activeNamespace}") AS ?Namespace).
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

  public createQueryParameter(activeGraph, activeNamespace: String, graph: mandInfos, paramInfo: parameterInfo) {
    var insertString = `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX owl: <http://www.w3.org/2002/07/owl#>
          PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
          INSERT { GRAPH <${activeGraph}> {
              ?method rdf:type wadl:${graph.method};
              a owl:NamedIndividual.
  
              ?request rdf:type wadl:Request; 
              a owl:NamedIndividual. 
  
              ?parameter rdf:type wadl:QueryParameter;
              a owl:NamedIndividual; 
              wadl:hasParameterName "${paramInfo.paramName}"^^xsd:NMTOKEN;
              wadl:hasParameterType ?parameter_type.

              ?option rdf:type wadl:Option;
              a owl:NamedIndividual;
              wadl:hasOptionValue ?option_value.
              
              ?method wadl:hasRequest ?request. 
              ?request wadl:hasParameter ?parameter.
              ?parameter wadl:hasParameterOption ?option.}

                  } WHERE {
                          BIND(STR("${activeNamespace}") AS ?Namespace).
              
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

  public createHeaderParameter(activeGraph, activeNamespace: String, graph: mandInfos, headerInfo: headerInfo) {
    var insertString = `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX owl: <http://www.w3.org/2002/07/owl#>
          PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
          INSERT { GRAPH <${activeGraph}> {
              ?method rdf:type wadl:${graph.method};
              a owl:NamedIndividual.
  
              ?request rdf:type wadl:Request; 
              a owl:NamedIndividual. 
  
              ?parameter rdf:type wadl:HeaderParameter;
              a owl:NamedIndividual;
              wadl:hasParameterName "${headerInfo.key}"^^xsd:NMTOKEN.

              ?representation rdf:type wadl:Representation;
              a owl:NamedIndividual;
              wadl:hasMediaType "${headerInfo.mediaType}"^^rdfs:Literal.
              
              ?method wadl:hasRequest ?request. 
              ?request wadl:hasParameter ?parameter.
              ?parameter wadl:hasRepresentation ?representation.}

                  } WHERE {
                          BIND(STR("${activeNamespace}") AS ?Namespace).
              
                          BIND(STR(CONCAT("${graph.baseUrl}", "${graph.resourceName}", "_${graph.method}")) AS ?method_name).
                          BIND(IRI(CONCAT(?Namespace, ?method_name)) AS ?method).

                          BIND(STR(CONCAT(?method_name, "_Req")) AS ?request_name).
                          BIND(IRI(CONCAT(?Namespace, ?request_name)) AS ?request).

                          BIND(STR(CONCAT(?request_name, "_Head_${headerInfo.key}")) AS ?parameter_name).
                          BIND(IRI(CONCAT(?Namespace, ?parameter_name)) AS ?parameter).

                          BIND(STR(CONCAT(?parameter_name, "_Rep")) AS ?representation_name).
                          BIND(IRI(CONCAT(?Namespace, ?representation_name)) AS ?representation).                
                  }
          `;
    return insertString;
  };

  public deleteServiceProvider(baseUrl: String, serviceProvider: String) {
    var deleteString = `			
          PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
          DELETE WHERE {
          <${serviceProvider}> wadl:hasService <${baseUrl}>.
          }
      `;
    return deleteString;
  }

  public deleteQueryParameter(activeNamespace: String, graph: mandInfos, paramInfo: parameterInfo) {
    var deleteString = `
          PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX owl: <http://www.w3.org/2002/07/owl#>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
          
          DELETE WHERE {
                  <${activeNamespace}${graph.baseUrl}${graph.resourceName}_${graph.method}_Req_${paramInfo.paramName}> rdf:type wadl:QueryParameter;
                          a owl:NamedIndividual;
                          wadl:hasParameterName ?name;
                          wadl:hasParameterType ?type;
                          wadl:hasParameterOption ?option.
                          ?option rdf:type wadl:Option;
                          a owl:NamedIndividual;
                          wadl:hasOptionValue ?value.
                      };
          
          DELETE WHERE {
              <${activeNamespace}${graph.baseUrl}${graph.resourceName}_${graph.method}_Req_${paramInfo.paramName}> rdf:type wadl:QueryParameter;
                          a owl:NamedIndividual;
                          wadl:hasParameterName ?name;
                          wadl:hasParameterOption ?option.
                          ?option rdf:type wadl:Option;
                          a owl:NamedIndividual;
                          wadl:hasOptionValue ?value.
                      };
          DELETE WHERE {
              <${activeNamespace}${graph.baseUrl}${graph.resourceName}_${graph.method}_Req_${paramInfo.paramName}> rdf:type wadl:QueryParameter;
                          a owl:NamedIndividual;
                          wadl:hasParameterName ?name;
                          wadl:hasParameterOption ?option.
                          ?option rdf:type wadl:Option;
                          a owl:NamedIndividual;
                      };
          `;

    return deleteString;
  };

  public deleteQueryOptionValue(activeNamespace: String, graph: mandInfos, paramInfo: parameterInfo) {
    var deleteString = `
          PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>

          DELETE WHERE { 
               <${activeNamespace}${graph.baseUrl}${graph.resourceName}_${graph.method}_Req_${paramInfo.paramName}_Option> wadl:hasOptionValue "${paramInfo.optionValue}";
          }
          `;
    console.log(deleteString);
    return deleteString;
  };

  public deleteQueryParameterType(activeNamespace: String, graph: mandInfos, paramInfo: parameterInfo) {
    var deleteString = `
          PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
          DELETE WHERE { 
               <${activeNamespace}${graph.baseUrl}${graph.resourceName}_${graph.method}_Req_${paramInfo.paramName}> wadl:hasParameterType "${paramInfo.paramType}";
          }
          `;

    return deleteString;
  };

  public deleteHeaderParameter(activeNamespace: String, graph: mandInfos, headerInfo: headerInfo) {
    var deleteString = `
          PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>

          DELETE WHERE {
              <${activeNamespace}${graph.baseUrl}${graph.resourceName}_${graph.method}_Req_Head_${headerInfo.key}> rdf:type wadl:HeaderParameter;
              a owl:NamedIndividual;
              wadl:hasParameterName "${headerInfo.key}"^^xsd:NMTOKEN;
          wadl:hasRepresentation ?rep.
        
        ?rep rdf:type wadl:Representation;
           a owl:NamedIndividual;
              wadl:hasMediaType "${headerInfo.mediaType}"^^rdfs:Literal.
    }
          `;
    return deleteString;
  }
}