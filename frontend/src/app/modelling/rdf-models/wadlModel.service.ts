import { Injectable } from '@angular/core';
import { PrefixesService } from '../../shared/services/prefixes.service';
import { QueriesService } from '../../shared/services/backEnd/queries.service';
import { GraphOperationsService } from '../../shared/services/backEnd/graphOperations.service';
import { DataLoaderService } from '../../shared/services/dataLoader.service';
import { DownloadService } from '../../shared/services/backEnd/download.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class WadlModelService {

    wadlData = new WADLDATA();
    wadlInsert = new WADLINSERT();

    public TABLE_BASE_RESOURCES: Array<Record<string, any>> = [];
    public TABLE_SERVICES: Array<Record<string, any>> = [];
    public TABLE_OF_REQUEST_PARAMETERS: Array<Record<string, any>> = [];

    public LIST_BASE_RESOURCES: Array<string> = [];
    public LIST_SERVICES: Array<string> = [];
    public LIST_OF_METHODS: Array<string> = [];
    public LIST_OF_PARAMETER_TYPES: Array<string> = [];
    public LIST_OF_RESPONSE_CODES: Array<string> = [];
    public LIST_ONTOLOGICAL_TYPES_BY_NAMESPACE: Array<string> = [];

    constructor(
        private query: QueriesService,
        private nameService: PrefixesService,
        private loadingScreenService: DataLoaderService,
        private downloadService: DownloadService,
        private graphs: GraphOperationsService
    ) {
        this.initializeWADL();
    }

    public initializeWADL() {

        this.loadTABLE_BASE_RESOURCES().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.TABLE_BASE_RESOURCES = data;
        });
        this.loadTABLE_SERVICES().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.TABLE_SERVICES = data;
        });
        this.loadLIST_BASE_RESOURCES().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.LIST_BASE_RESOURCES = data;
        });
        this.loadLIST_SERVICES().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.LIST_SERVICES = data;
        });
        this.loadLIST_OF_METHODS().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.LIST_OF_METHODS = data;
        });
        this.loadLIST_OF_PARAMETER_TYPES().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.LIST_OF_PARAMETER_TYPES = data;
        });
        this.loadLIST_OF_RESPONSE_CODES().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.LIST_OF_RESPONSE_CODES = data;
        });
    }

    // loader
    public loadTABLE_BASE_RESOURCES() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.wadlData.SELECT_TABLE_BASE_RESOURCES);
    }
    public loadTABLE_SERVICES() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.wadlData.SELECT_TABLE_SERVICES);
    }
    public loadLIST_BASE_RESOURCES() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_LIST(this.wadlData.SELECT_TABLE_BASE_RESOURCES, 0);
    }
    public loadLIST_SERVICES() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_LIST(this.wadlData.SELECT_TABLE_SERVICES, 1);
    }
    public loadLIST_OF_METHODS() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_LIST(this.wadlData.SELECT_LIST_OF_METHODS, 0);
    }
    public loadLIST_OF_PARAMETER_TYPES() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_LIST(this.wadlData.SELECT_LIST_OF_PARAMETER_TYPES, 0);
    }
    public loadLIST_OF_RESPONSE_CODES() {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_LIST(this.wadlData.SELECT_LIST_OF_RESPONSE_CODES, 0);
    }
    public loadLIST_OF_SERVICES_BY_BASE(BASE_IRI) {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_LIST(this.wadlData.SELECT_LIST_OF_SERVICES_BY_BASE(BASE_IRI), 0);
    }
    public loadTABLE_OF_REQUEST_PARAMETERS(serviceIRI, methodIRI, parameterTypeIRI) {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.wadlData.SELECT_TABLE_OF_REQUEST_PARAMETERS(serviceIRI, methodIRI, parameterTypeIRI));
    }
    public loadTABLE_OF_REQUEST_REPRESENTATION(serviceIRI, methodIRI) {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.wadlData.SELECT_TABLE_OF_REQUEST_REPRESENTATION(serviceIRI, methodIRI));
    }
    public loadTABLE_OF_RESPONSE_REPRESENTATION(serviceIRI, methodIRI) {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_TABLE(this.wadlData.SELECT_TABLE_OF_RESPONSE_REPRESENTATION(serviceIRI, methodIRI));
    }
    public loadLIST_ONTOLOGICAL_TYPES_BY_NAMESPACE(owlEntity) {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_LIST(this.wadlData.SELECT_LIST_ONTOLOGICAL_TYPES_BY_NAMESPACE(owlEntity), 0);
    }
    public loadLIST_INDIVIDUALS_BY_CLASS(classIRI) {
        this.loadingScreenService.startLoading();
        return this.query.SPARQL_SELECT_LIST(this.wadlData.SELECT_LIST_INDIVIDUALS_BY_CLASS(classIRI), 0);
    }
    // setter
    public setTABLE_BASE_RESOURCES(table) { this.TABLE_BASE_RESOURCES = table; }
    public setTABLE_SERVICES(table) { this.TABLE_SERVICES = table; }
    public setLIST_BASE_RESOURCES(list) { this.LIST_BASE_RESOURCES = list; }
    public setLIST_SERVICES(list) { this.LIST_SERVICES = list; }


    // getter
    public getTABLE_BASE_RESOURCES() { return this.TABLE_BASE_RESOURCES; }
    public getTABLE_SERVICES() { return this.TABLE_SERVICES; }
    public getLIST_BASE_RESOURCES() { return this.LIST_BASE_RESOURCES; }
    public getLIST_SERVICES() { return this.LIST_SERVICES; }
    public getLIST_OF_METHODS() { return this.LIST_OF_METHODS; }
    public getLIST_OF_PARAMETER_TYPES() { return this.LIST_OF_PARAMETER_TYPES; }
    public getLIST_OF_RESPONSE_CODES() { return this.LIST_OF_RESPONSE_CODES; }

    public modifyBaseResource(variables: WADLVARIABLES, action: string) {
        const GRAPHS = this.graphs.getGraphs();
        const activeGraph = GRAPHS[this.graphs.getActiveGraph()];
        switch (action) {
        case "add": {
            console.log("i was executed");
            console.log(this.wadlInsert.createBaseResource(variables, activeGraph));
            return this.query.executeUpdate(this.wadlInsert.createBaseResource(variables, activeGraph));
        }
        case "delete": {
            return this.query.executeUpdate(this.wadlInsert.deleteBaseResource(variables));
        }
        case "build": {
            const blobObserver = new Observable((observer) => {
                const insertString = this.wadlInsert.createBaseResource(variables, activeGraph);
                const blob = new Blob([insertString], { type: 'text/plain' });
                const name = 'insert.txt';
                this.downloadService.download(blob, name);
                observer.next();
                observer.complete();
            });
            return blobObserver;
        }
        }

    }

    public modifyService(variables: WADLVARIABLES, action: string) {
        const GRAPHS = this.graphs.getGraphs();
        const activeGraph = GRAPHS[this.graphs.getActiveGraph()];

        switch (action) {
        case "add": {
            console.log("i was executed");
            console.log(this.wadlInsert.createService(variables, activeGraph));
            return this.query.executeUpdate(this.wadlInsert.createService(variables, activeGraph));
        }
        case "delete": {
            return this.query.executeUpdate(this.wadlInsert.deleteService(variables));
        }
        case "build": {
            const blobObserver = new Observable((observer) => {
                const insertString = this.wadlInsert.createService(variables, activeGraph);
                const blob = new Blob([insertString], { type: 'text/plain' });
                const name = 'insert.txt';
                this.downloadService.download(blob, name);
                observer.next();
                observer.complete();
            });
            return blobObserver;
        }
        }
    }
    public modifyRequest(variables: WADLVARIABLES, action: string) {
        const GRAPHS = this.graphs.getGraphs();
        const activeGraph = GRAPHS[this.graphs.getActiveGraph()];

        switch (action) {
        case "add": {
            return this.query.executeUpdate(this.wadlInsert.createRequest(variables, activeGraph));
        }
        case "delete": {
            return this.query.executeUpdate(this.wadlInsert.deleteRequest(variables));
        }
        case "build": {
            const blobObserver = new Observable((observer) => {
                const insertString = this.wadlInsert.createRequest(variables, activeGraph);
                const blob = new Blob([insertString], { type: 'text/plain' });
                const name = 'insert.txt';
                this.downloadService.download(blob, name);
                observer.next();
                observer.complete();
            });
            return blobObserver;
        }
        }
    }
    public modifyResponse(variables: WADLVARIABLES, action: string) {
        const GRAPHS = this.graphs.getGraphs();
        const activeGraph = GRAPHS[this.graphs.getActiveGraph()];

        switch (action) {
        case "add": {
            return this.query.executeUpdate(this.wadlInsert.createResponse(variables, activeGraph));
        }
        case "delete": {
            return this.query.executeUpdate(this.wadlInsert.deleteResponse(variables));
        }
        case "build": {
            const blobObserver = new Observable((observer) => {
                const insertString = this.wadlInsert.createResponse(variables, activeGraph);
                const blob = new Blob([insertString], { type: 'text/plain' });
                const name = 'insert.txt';
                this.downloadService.download(blob, name);
                observer.next();
                observer.complete();
            });
            return blobObserver;
        }
        }
    }
    public deleteOption(variables: WADLVARIABLES) {
        return this.query.executeUpdate(this.wadlInsert.deleteOption(variables));
    }
    public deleteParameter(variables: WADLVARIABLES) {
        return this.query.executeUpdate(this.wadlInsert.deleteParameter(variables));
    }
}




export class WADLDATA {


    public SELECT_TABLE_BASE_RESOURCES = `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  SELECT ?baseResource ?basePath ?serviceProvider WHERE
	{
     	?baseResource rdf:type wadl:Resources;
      a owl:NamedIndividual;
      wadl:hasBase ?basePath;
      wadl:RestResourcesAreProvidedByEntity ?serviceProvider.

  }
  `

    public SELECT_TABLE_SERVICES = `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  SELECT ?baseResource ?service ?basePath ?servicePath WHERE
	{
    ?baseResource wadl:hasResource ?service;
                  wadl:hasBase ?basePath.

    ?service rdf:type wadl:Resource;
    a owl:NamedIndividual;
    wadl:hasPath ?servicePath.
  }`;

    public SELECT_LIST_OF_METHODS = `
  PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
  SELECT DISTINCT ?methods
  WHERE {
    ?methods sesame:directSubClassOf wadl:Method.
  }`;

    public SELECT_LIST_OF_RESPONSE_CODES = `
  PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
  SELECT DISTINCT ?methods
  WHERE {
    ?methods sesame:directSubClassOf wadl:Response.
  }`;

    public SELECT_LIST_OF_PARAMETER_TYPES = `
  PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
  SELECT DISTINCT ?parameter
  WHERE {
    ?parameter sesame:directSubClassOf wadl:Parameter.
  }`;

    public SELECT_LIST_OF_SERVICES_BY_BASE(BASE_IRI) {

        const selectString = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?service WHERE
    {
      <${BASE_IRI}> wadl:hasResource ?service.
      ?service rdf:type wadl:Resource.
    }`;
        return selectString;
    }

    public SELECT_TABLE_OF_REQUEST_PARAMETERS(serviceIRI, methodIRI, parameterTypeIRI) {

        const selectString = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>

    SELECT DISTINCT ?parameter ?parameterKey ?dataType ?optionValue WHERE {
      BIND(<${serviceIRI}> AS ?service).
      BIND(<${methodIRI}> AS ?Method).
      BIND(<${parameterTypeIRI}> AS ?Parameter).


      ?service wadl:hasMethod ?method.

      ?method rdf:type ?Method;
       	a owl:NamedIndividual;
 		    wadl:hasRequest ?request.

      ?request rdf:type wadl:Request;
       	a owl:NamedIndividual;
  	    wadl:hasParameter ?parameter.

      ?parameter rdf:type ?Parameter;
        a owl:NamedIndividual;
        wadl:hasParameterName ?parameterKey.

        OPTIONAL {?parameter  wadl:hasParameterType ?nonOntologicalDataType.}
        OPTIONAL {?parameter  wadl:hasOntologicalParameterType ?ontologicalDataTypeABox.}
        OPTIONAL {?parameter  rdf:type ?ontologicalDataTypeTBox. MINUS {?ontologicalDataTypeTBox rdfs:subClassOf wadl:Parameter.}
        FILTER(STRSTARTS(STR(?ontologicalDataTypeTBox), "http://www.hsu-ifa.de"))
        }
        {BIND(IF(STRLEN(?nonOntologicalDataType) > 0 ,?nonOntologicalDataType,BNODE()) AS ?dataType).}UNION
        {BIND(IF(BOUND(?ontologicalDataTypeABox),?ontologicalDataTypeABox,BNODE()) AS ?dataType).}UNION
        {BIND(IF(BOUND(?ontologicalDataTypeTBox),?ontologicalDataTypeTBox,BNODE()) AS ?dataType).}
        FILTER(!ISBLANK(?dataType))

      OPTIONAL{
        ?parameter wadl:hasParameterOption ?option.
        ?option rdf:type wadl:Option;
        a owl:NamedIndividual;
        wadl:hasOptionValue ?optionValue.}
      } `;
        return selectString;
    }

    public SELECT_TABLE_OF_REQUEST_REPRESENTATION(serviceIRI, methodIRI) {
        const selectString = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>

    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT DISTINCT ?bodyRepresentation ?bodyMediaType ?bodyParameterKey ?bodyDataType ?bodyOptionValue WHERE {
    BIND(<${serviceIRI}> AS ?service).
    BIND(<${methodIRI}> AS ?Method).

    ?service wadl:hasMethod ?method.

    ?method rdf:type ?Method;
     	a owl:NamedIndividual;
 	    wadl:hasRequest ?request.

    ?request rdf:type wadl:Request;
     	a owl:NamedIndividual;
  	  wadl:hasRepresentation ?bodyRepresentation.

    ?bodyRepresentation rdf:type wadl:Representation;
      a owl:NamedIndividual;
      wadl:hasMediaType ?bodyMediaType;
      wadl:hasParameter ?bodyRepresentationParameter.

    ?bodyRepresentationParameter rdf:type wadl:Parameter;
      a owl:NamedIndividual;
      wadl:hasParameterName ?bodyParameterKey.

      OPTIONAL {?bodyRepresentationParameter  wadl:hasParameterType ?nonOntologicalDataType.}
      OPTIONAL {?bodyRepresentationParameter  wadl:hasOntologicalParameterType ?ontologicalDataTypeABox.}
      OPTIONAL {?bodyRepresentationParameter  rdf:type ?ontologicalDataTypeTBox. MINUS {?ontologicalDataTypeTBox rdfs:subClassOf wadl:Parameter.}
      FILTER(STRSTARTS(STR(?ontologicalDataTypeTBox), "http://www.hsu-ifa.de"))
      }
      {BIND(IF(STRLEN(?nonOntologicalDataType) > 0 ,?nonOntologicalDataType,BNODE()) AS ?bodyDataType).}UNION
      {BIND(IF(BOUND(?ontologicalDataTypeABox),?ontologicalDataTypeABox,BNODE()) AS ?bodyDataType).}UNION
      {BIND(IF(BOUND(?ontologicalDataTypeTBox),?ontologicalDataTypeTBox,BNODE()) AS ?bodyDataType).}
      FILTER(!ISBLANK(?bodyDataType))

    OPTIONAL {
        ?bodyRepresentationParameter wadl:hasParameterOption ?bodyRepresentationParameterOption.
        ?bodyRepresentationParameterOption rdf:type wadl:Option;
        a owl:NamedIndividual;
        wadl:hasOptionValue ?bodyOptionValue.
    }} `;
        return selectString;
    }
    public SELECT_TABLE_OF_RESPONSE_REPRESENTATION(serviceIRI, methodIRI) {
        const selectString = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>

    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT DISTINCT ?bodyRepresentation ?bodyMediaType ?bodyParameterKey ?bodyDataType ?bodyOptionValue WHERE {
    BIND(<${serviceIRI}> AS ?service).
    BIND(<${methodIRI}> AS ?Method).

    ?service wadl:hasMethod ?method.

    ?method rdf:type ?Method;
     	a owl:NamedIndividual;
 	    wadl:hasResponse ?response.

    ?response rdf:type wadl:Response;
     	a owl:NamedIndividual;
  	  wadl:hasRepresentation ?bodyRepresentation.

    ?bodyRepresentation rdf:type wadl:Representation;
      a owl:NamedIndividual;
      wadl:hasMediaType ?bodyMediaType;
      wadl:hasParameter ?bodyRepresentationParameter.

    ?bodyRepresentationParameter rdf:type wadl:Parameter;
      a owl:NamedIndividual;
      wadl:hasParameterName ?bodyParameterKey.

      OPTIONAL {?bodyRepresentationParameter  wadl:hasParameterType ?nonOntologicalDataType.}
      OPTIONAL {?bodyRepresentationParameter  wadl:hasOntologicalParameterType ?ontologicalDataTypeABox.}
      OPTIONAL {?bodyRepresentationParameter  rdf:type ?ontologicalDataTypeTBox. MINUS {?ontologicalDataTypeTBox rdfs:subClassOf wadl:Parameter.}
      FILTER(STRSTARTS(STR(?ontologicalDataTypeTBox), "http://www.hsu-ifa.de"))
      }
      {BIND(IF(STRLEN(?nonOntologicalDataType) > 0 ,?nonOntologicalDataType,BNODE()) AS ?bodyDataType).}UNION
      {BIND(IF(BOUND(?ontologicalDataTypeABox),?ontologicalDataTypeABox,BNODE()) AS ?bodyDataType).}UNION
      {BIND(IF(BOUND(?ontologicalDataTypeTBox),?ontologicalDataTypeTBox,BNODE()) AS ?bodyDataType).}
      FILTER(!ISBLANK(?bodyDataType))

    OPTIONAL {
        ?bodyRepresentationParameter wadl:hasParameterOption ?bodyRepresentationParameterOption.
        ?bodyRepresentationParameterOption rdf:type wadl:Option;
        a owl:NamedIndividual;
        wadl:hasOptionValue ?bodyOptionValue.
    }} `;
        return selectString;
    }

    public SELECT_LIST_ONTOLOGICAL_TYPES_BY_NAMESPACE(Namespace) {
        const selectString = `
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
    PREFIX sesame: <http://www.openrdf.org/schema/sesame#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    SELECT DISTINCT ?class
    WHERE {
      ?class a owl:Class.
      FILTER(STRSTARTS(STR(?class), "${Namespace}"))
    }`;
        return selectString;
    }

    public SELECT_LIST_INDIVIDUALS_BY_CLASS(ClassIRI) {
        const selectString = `
    SELECT ?individal WHERE {
      ?individal a <${ClassIRI}> .
    }`;
        return selectString;
    }

}
export class WADLVARIABLES {
    serviceProviderIRI: string;
    baseResourceIRI: string;
    baseResourcePath: string;
    serviceIRI: string;
    servicePath: string;
    methodTypeIRI: string;
    methodIRI: string;
    requestIRI: string;
    parameterTypeIRI: string;
    parameterIRI: string;
    parameterKey: string;
    parameterDataType: string;
    parameterDataTypeABox: string;
    parameterDataTypeTBox: string;
    optionIRI: string;
    optionValue: string;
    bodyRepresentationIRI: string;
    bodyRepresentationMediaType: string;
    bodyRepresentationParameterIRI: string;
    bodyRepresentationParameterKey: string;
    bodyRepresentationParameterDataType: string;
    bodyRepresentationParameterDataTypeOntologicalABox: string;
    bodyRepresentationParameterDataTypeOntologicalTBox: string;
    bodyRepresentationParameterOptionIRI: string;
    bodyRepresentationParameterOptionValue: string;
    responseIRI: string;
    responseTypeIRI: string;

}


export class WADLINSERT {


    public createBaseResource(variables: WADLVARIABLES, activeGraph: string) {

        const insertString = `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  INSERT
	{ GRAPH <${activeGraph}> {

     	?baseResource rdf:type wadl:Resources;
      a owl:NamedIndividual;
      wadl:hasBase "${variables.baseResourcePath}"^^xsd:anyURI;
      wadl:RestResourcesAreProvidedByEntity ?serviceProvider.

  }
  } WHERE {
    BIND(<${variables.baseResourceIRI}> AS ?baseResource).
    BIND(<${variables.serviceProviderIRI}> AS ?serviceProvider).
  }
  `;
        return insertString;
    }

    public createService(variables: WADLVARIABLES, activeGraph: string) {
        const insertString = `
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  INSERT
	{ GRAPH <${activeGraph}> {

     	  ?baseResource wadl:hasResource ?service.

        ?service rdf:type wadl:Resource;
        a owl:NamedIndividual;
        wadl:hasPath "${variables.servicePath}"^^xsd:string.
  }
  } WHERE {
    BIND(<${variables.baseResourceIRI}> AS ?baseResource).
    BIND(<${variables.serviceIRI}> AS ?service).
  }
  `;
        return insertString;
    }

    public createRequest(variables: WADLVARIABLES, activeGraph: string) {

        const optionals = {
            parameter: `
      BIND(<${variables.parameterIRI}> AS ?parameter).
      BIND(<${variables.parameterTypeIRI}> AS ?parameterType)
      `,
            parameterOption: `BIND(<${variables.optionIRI}> AS ?option).`,
            representation: `
      BIND(<${variables.bodyRepresentationIRI}> AS ?bodyRepresentation).
      BIND(<${variables.bodyRepresentationParameterIRI}> AS ?bodyRepresentationParameter).`,
            representationOption: `BIND(<${variables.bodyRepresentationParameterOptionIRI}> AS ?bodyRepresentationParameterOption).`,
            parameterDataTypeNonOntological: `?parameter wadl:hasParameterType "${variables.parameterDataType}"^^xsd:string.`,
            parameterDataTypeOntologicalABox: `?parameter wadl:hasOntologicalParameterType <${variables.parameterDataTypeABox}>.`,
            parameterDataTypeOntologicalTBox: `?parameter rdf:type <${variables.parameterDataTypeTBox}>.`,

            bodyParameterDataTypeNonOntological: `?bodyRepresentationParameter wadl:hasParameterType "${variables.bodyRepresentationParameterDataType}"^^xsd:string.`,
            bodyParameterDataTypeOntologicalABox: `?bodyRepresentationParameter wadl:hasOntologicalParameterType <${variables.bodyRepresentationParameterDataTypeOntologicalABox}>.`,
            bodyParameterDataTypeOntologicalTBox: `?bodyRepresentationParameter rdf:type <${variables.bodyRepresentationParameterDataTypeOntologicalTBox}>.`
        };

        // add a check for empties and if one is found delete the string
        for (const i in optionals) {
            const element = optionals[i];
            if (element.search('undefined') != -1) { optionals[i] = ""; }
            // console.log(element);
        }

        const insertString = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    INSERT { GRAPH <${activeGraph}> {
      ?service wadl:hasMethod ?method.

      ?method rdf:type <${variables.methodTypeIRI}>;
       	a owl:NamedIndividual;
 			 	wadl:hasRequest ?request.

      ?request rdf:type wadl:Request;
         a owl:NamedIndividual.

       # for parameter
      ?request	wadl:hasParameter ?parameter.

      ?parameter rdf:type ?parameterType;
        a owl:NamedIndividual;
        wadl:hasParameterName "${variables.parameterKey}"^^xsd:NMTOKEN;
        wadl:hasParameterOption ?option.
        ${optionals.parameterDataTypeNonOntological}
        ${optionals.parameterDataTypeOntologicalTBox}
        ${optionals.parameterDataTypeOntologicalABox}

      ?option rdf:type wadl:Option;
        a owl:NamedIndividual;
        wadl:hasOptionValue "${variables.optionValue}"^^xsd:string.

        # for representation
        ?request wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation rdf:type wadl:Representation;
         a owl:NamedIndividual;
         wadl:hasMediaType "${variables.bodyRepresentationMediaType}";
         wadl:hasParameter ?bodyRepresentationParameter.

         ?bodyRepresentationParameter rdf:type wadl:Parameter;
         a owl:NamedIndividual;
         wadl:hasParameterName "${variables.bodyRepresentationParameterKey}"^^xsd:NMTOKEN;
         wadl:hasParameterOption ?bodyRepresentationParameterOption.
         ${optionals.bodyParameterDataTypeNonOntological}
         ${optionals.bodyParameterDataTypeOntologicalTBox}
         ${optionals.bodyParameterDataTypeOntologicalABox}

         ?bodyRepresentationParameterOption rdf:type wadl:Option;
         a owl:NamedIndividual;
         wadl:hasOptionValue "${variables.bodyRepresentationParameterOptionValue}"^^xsd:string.
        }

      } WHERE {
        BIND(<${variables.serviceIRI}> AS ?service).
        BIND(<${variables.methodIRI}> AS ?method).
        BIND(<${variables.requestIRI}> AS ?request).
        ${optionals.parameter}
        ${optionals.parameterOption}
        ${optionals.representation}
        ${optionals.representationOption}
      }`;
        console.log(insertString);
        return insertString;
    }
    public createResponse(variables: WADLVARIABLES, activeGraph: string) {

        const optionals = {
            representation: `
      BIND(<${variables.bodyRepresentationIRI}> AS ?bodyRepresentation).
      BIND(<${variables.bodyRepresentationParameterIRI}> AS ?bodyRepresentationParameter).`,
            bodyParameterDataTypeNonOntological: `?bodyRepresentationParameter wadl:hasParameterType "${variables.bodyRepresentationParameterDataType}"^^xsd:string.`,
            bodyParameterDataTypeOntologicalABox: `?bodyRepresentationParameter wadl:hasOntologicalParameterType <${variables.bodyRepresentationParameterDataTypeOntologicalABox}>.`,
            bodyParameterDataTypeOntologicalTBox: `?bodyRepresentationParameter rdf:type <${variables.bodyRepresentationParameterDataTypeOntologicalTBox}>.`,
            representationOption: `BIND(<${variables.bodyRepresentationParameterOptionIRI}> AS ?bodyRepresentationParameterOption).`

        };

        // add a check for empties and if one is found delete the string
        for (const i in optionals) {
            const element = optionals[i];
            if (element.search(`undefined`) != -1) { optionals[i] = ""; }
            // console.log(element);
        }

        const insertString = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    INSERT { GRAPH <${activeGraph}> {
      ?service wadl:hasMethod ?method.

      ?method rdf:type <${variables.methodTypeIRI}>;
       	a owl:NamedIndividual;
 			 	wadl:hasResponse ?response.

      ?response rdf:type wadl:Response;
        rdf:type <${variables.responseTypeIRI}>;
        a owl:NamedIndividual.

        # for representation
        ?response wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation rdf:type wadl:Representation;
         a owl:NamedIndividual;
         wadl:hasMediaType "${variables.bodyRepresentationMediaType}";
         wadl:hasParameter ?bodyRepresentationParameter.
         ${optionals.bodyParameterDataTypeNonOntological}
         ${optionals.bodyParameterDataTypeOntologicalTBox}
         ${optionals.bodyParameterDataTypeOntologicalABox}

        ?bodyRepresentationParameter rdf:type wadl:Parameter;
         a owl:NamedIndividual;
         wadl:hasParameterName "${variables.bodyRepresentationParameterKey}"^^xsd:NMTOKEN;
         wadl:hasParameterOption ?bodyRepresentationParameterOption.


        ?bodyRepresentationParameterOption rdf:type wadl:Option;
         a owl:NamedIndividual;
         wadl:hasOptionValue "${variables.bodyRepresentationParameterOptionValue}"^^xsd:string.
        }

      } WHERE {
        BIND(<${variables.serviceIRI}> AS ?service).
        BIND(<${variables.methodIRI}> AS ?method).
        BIND(<${variables.responseIRI}> AS ?response).
        ${optionals.representation}
        ${optionals.representationOption}
      }`;
        console.log(insertString);
        return insertString;
    }

    public deleteOption(variables: WADLVARIABLES) {

        const deleteString = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    DELETE  {
      ?parameter wadl:hasParameterOption ?option.
      ?option rdf:type wadl:Option;
          a owl:NamedIndividual.
          ?option wadl:hasOptionValue ?optionVal.

    } WHERE {
      ?parameter wadl:hasParameterName "${variables.parameterKey}"^^xsd:NMTOKEN;
      wadl:hasParameterOption ?option.
      ?option rdf:type wadl:Option;
      a owl:NamedIndividual.
      ?option wadl:hasOptionValue ?optionVal.
      }
    `;
        console.log(deleteString);
        return deleteString;

    }

    public deleteParameter(variables: WADLVARIABLES) {

        const deleteString = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    DELETE  {
      ?option ?predicate ?object.

    } WHERE {
      ?parameter wadl:hasParameterName "${variables.parameterKey}"^^xsd:NMTOKEN;
      wadl:hasParameterOption ?option.
      ?option ?predicate ?object.
      };

      DELETE  {
        ?parameter ?predicate ?object.

      } WHERE {
        ?parameter wadl:hasParameterName "${variables.parameterKey}"^^xsd:NMTOKEN;
            ?predicate ?object.
        }
    `;
        console.log(deleteString);
        return deleteString;
    }

    deleteBaseResource(variables: WADLVARIABLES) {
        const deleteString = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    DELETE {

      ?bodyRepresentationParameterOption ?predicate ?object.

      } WHERE {

        <${variables.baseResourceIRI}> wadl:hasResource ?service.
        ?service wadl:hasMethod ?method.
        ?method wadl:hasRequest ?request.
        ?request wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.
        ?bodyRepresentationParameter wadl:hasParameterOption ?bodyRepresentationParameterOption.

        ?bodyRepresentationParameterOption ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentationParameter ?predicate ?object.

      } WHERE {

        <${variables.baseResourceIRI}> wadl:hasResource ?service.
        ?service wadl:hasMethod ?method.
        ?method wadl:hasRequest ?request.
        ?request wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.

        ?bodyRepresentationParameter ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentation ?predicate ?object.

      } WHERE {

        <${variables.baseResourceIRI}> wadl:hasResource ?service.
        ?service wadl:hasMethod ?method.
        ?method wadl:hasRequest ?request.
        ?request wadl:hasRepresentation ?bodyRepresentation.

        ?bodyRepresentation ?predicate ?object.
      };
      DELETE {

        ?option ?predicate ?object.

      } WHERE {

          <${variables.baseResourceIRI}> wadl:hasResource ?service.
          ?service wadl:hasMethod ?method.
          ?method wadl:hasRequest ?request.
          ?request wadl:hasParameter ?parameter.
          ?parameter wadl:hasParameterOption ?option.

          ?option ?predicate ?object.
        };
    DELETE {

        ?parameter ?predicate ?object.

      } WHERE {

          <${variables.baseResourceIRI}> wadl:hasResource ?service.
          ?service wadl:hasMethod ?method.
          ?method wadl:hasRequest ?request.
          ?request wadl:hasParameter ?parameter.

          ?parameter ?predicate ?object.
        };
    DELETE {

      ?request ?predicate ?object.

      } WHERE {

        <${variables.baseResourceIRI}> wadl:hasResource ?service.
        ?service wadl:hasMethod ?method.
        ?method wadl:hasRequest ?request.

        ?request ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentationParameterOption ?predicate ?object.

      } WHERE {

        <${variables.baseResourceIRI}> wadl:hasResource ?service.
        ?service wadl:hasMethod ?method.
        ?method wadl:hasResponse ?response.
        ?response wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.
        ?bodyRepresentationParameter wadl:hasParameterOption ?bodyRepresentationParameterOption.

        ?bodyRepresentationParameterOption ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentationParameter ?predicate ?object.

      } WHERE {

        <${variables.baseResourceIRI}> wadl:hasResource ?service.
        ?service wadl:hasMethod ?method.
        ?method wadl:hasResponse ?response.
        ?response wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.

        ?bodyRepresentationParameter ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentation ?predicate ?object.

      } WHERE {

        <${variables.baseResourceIRI}> wadl:hasResource ?service.
        ?service wadl:hasMethod ?method.
        ?method wadl:hasResponse ?response.
        ?response wadl:hasRepresentation ?bodyRepresentation.

        ?bodyRepresentation ?predicate ?object.
      };

    DELETE {

    ?response ?predicate ?object.

    } WHERE {

      <${variables.baseResourceIRI}> wadl:hasResource ?service.
      ?service wadl:hasMethod ?method.
      ?method wadl:hasResponse ?response.

      ?response ?predicate ?object.
    };
    DELETE {

      ?method ?predicate ?object.

    } WHERE {

      <${variables.baseResourceIRI}> wadl:hasResource ?service.
      ?service wadl:hasMethod ?method.

      ?method ?predicate ?object.
    };

    DELETE {

      ?service ?predicate ?object.

    } WHERE {

      <${variables.baseResourceIRI}> wadl:hasResource ?service.

      ?service ?predicate ?object.
    };
    DELETE WHERE {
      <${variables.baseResourceIRI}> ?predicate ?object.
    }
    `;
        console.log(deleteString);
        return deleteString;
    }
    deleteService(variables: WADLVARIABLES) {
        const deleteString = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    DELETE {

      ?bodyRepresentationParameterOption ?predicate ?object.

      } WHERE {

        <${variables.serviceIRI}> wadl:hasMethod ?method.
        ?method wadl:hasRequest ?request.
        ?request wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.
        ?bodyRepresentationParameter wadl:hasParameterOption ?bodyRepresentationParameterOption.

        ?bodyRepresentationParameterOption ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentationParameter ?predicate ?object.

      } WHERE {

        <${variables.serviceIRI}> wadl:hasMethod ?method.
        ?method wadl:hasRequest ?request.
        ?request wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.

        ?bodyRepresentationParameter ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentation ?predicate ?object.

      } WHERE {

        <${variables.serviceIRI}> wadl:hasMethod ?method.
        ?method wadl:hasRequest ?request.
        ?request wadl:hasRepresentation ?bodyRepresentation.

        ?bodyRepresentation ?predicate ?object.
      };
      DELETE {

        ?option ?predicate ?object.

      } WHERE {

        <${variables.serviceIRI}> wadl:hasMethod ?method.
          ?method wadl:hasRequest ?request.
          ?request wadl:hasParameter ?parameter.
          ?parameter wadl:hasParameterOption ?option.

          ?option ?predicate ?object.
        };
    DELETE {

        ?parameter ?predicate ?object.

      } WHERE {

        <${variables.serviceIRI}> wadl:hasMethod ?method.
          ?method wadl:hasRequest ?request.
          ?request wadl:hasParameter ?parameter.

          ?parameter ?predicate ?object.
        };
    DELETE {

      ?request ?predicate ?object.

      } WHERE {

        <${variables.serviceIRI}> wadl:hasMethod ?method.
        ?method wadl:hasRequest ?request.

        ?request ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentationParameterOption ?predicate ?object.

      } WHERE {

        <${variables.serviceIRI}> wadl:hasMethod ?method.
        ?method wadl:hasResponse ?response.
        ?response wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.
        ?bodyRepresentationParameter wadl:hasParameterOption ?bodyRepresentationParameterOption.

        ?bodyRepresentationParameterOption ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentationParameter ?predicate ?object.

      } WHERE {

        <${variables.serviceIRI}> wadl:hasMethod ?method.
        ?method wadl:hasResponse ?response.
        ?response wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.

        ?bodyRepresentationParameter ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentation ?predicate ?object.

      } WHERE {

        <${variables.serviceIRI}> wadl:hasMethod ?method.
        ?method wadl:hasResponse ?response.
        ?response wadl:hasRepresentation ?bodyRepresentation.

        ?bodyRepresentation ?predicate ?object.
      };

    DELETE {

    ?response ?predicate ?object.

    } WHERE {

      <${variables.serviceIRI}> wadl:hasMethod ?method.
      ?method wadl:hasResponse ?response.

      ?response ?predicate ?object.
    };
    DELETE {

      ?method ?predicate ?object.

    } WHERE {

      <${variables.serviceIRI}> wadl:hasMethod ?method.

      ?method ?predicate ?object.
    };
    DELETE WHERE {
      <${variables.serviceIRI}> ?predicate ?object.
    }
    `;
        console.log(deleteString);
        return deleteString;
    }
    deleteRequest(variables: WADLVARIABLES) {
        const deleteString = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    DELETE {

      ?bodyRepresentationParameterOption ?predicate ?object.

      } WHERE {
        <${variables.requestIRI}> wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.
        ?bodyRepresentationParameter wadl:hasParameterOption ?bodyRepresentationParameterOption.

        ?bodyRepresentationParameterOption ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentationParameter ?predicate ?object.

      } WHERE {

        <${variables.requestIRI}> wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.

        ?bodyRepresentationParameter ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentation ?predicate ?object.

      } WHERE {

        <${variables.requestIRI}> wadl:hasRepresentation ?bodyRepresentation.

        ?bodyRepresentation ?predicate ?object.
      };
      DELETE {

        ?option ?predicate ?object.

      } WHERE {

        <${variables.requestIRI}> wadl:hasParameter ?parameter.
          ?parameter wadl:hasParameterOption ?option.

          ?option ?predicate ?object.
        };
    DELETE {

        ?parameter ?predicate ?object.

      } WHERE {
          <${variables.requestIRI}> wadl:hasParameter ?parameter.

          ?parameter ?predicate ?object.
        };

    DELETE WHERE {
      <${variables.requestIRI}> ?predicate ?object.
    }
    `;
        console.log(deleteString);
        return deleteString;
    }

    deleteResponse(variables: WADLVARIABLES) {
        const deleteString = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    DELETE {

      ?bodyRepresentationParameterOption ?predicate ?object.

      } WHERE {

        <${variables.responseIRI}> wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.
        ?bodyRepresentationParameter wadl:hasParameterOption ?bodyRepresentationParameterOption.

        ?bodyRepresentationParameterOption ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentationParameter ?predicate ?object.

      } WHERE {

        <${variables.responseIRI}> wadl:hasRepresentation ?bodyRepresentation.
        ?bodyRepresentation wadl:hasParameter ?bodyRepresentationParameter.

        ?bodyRepresentationParameter ?predicate ?object.
      };
    DELETE {

      ?bodyRepresentation ?predicate ?object.

      } WHERE {

        <${variables.responseIRI}> wadl:hasRepresentation ?bodyRepresentation.

        ?bodyRepresentation ?predicate ?object.
      };

    DELETE WHERE {
      <${variables.responseIRI}> ?predicate ?object.
    }
    `;
        console.log(deleteString);
        return deleteString;
    }


}
