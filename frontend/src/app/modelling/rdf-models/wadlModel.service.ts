import { Injectable } from '@angular/core';
import { QueriesService } from '../../shared/services/backEnd/queries.service';
import { GraphOperationsService } from '../../shared/services/backEnd/graphOperations.service';
import { DownloadService } from '../../shared/services/backEnd/download.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { WadlBaseResource } from '@shared/models/odps/wadl/BaseResource';
import { WadlResource } from '@shared/models/odps/wadl/Resource';
import { WadlMethod } from '@shared/models/odps/wadl/WadlMethod';
import { WadlResponse } from '@shared/models/odps/wadl/WadlResponse';


@Injectable({
    providedIn: 'root'
})
export class WadlModelService {

    wadlBasePath = "lion_BE/wadl"

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
        private http: HttpClient,
        private query: QueriesService,
        private downloadService: DownloadService,
        private graphs: GraphOperationsService
    ) {}

    /**
     * Get all existing base resources
     * @returns A SparqlResponse object with all base resources, their base paths and the entity providing the base path
     */
    getBaseResources(): Observable<SparqlResponse> {
        const url = `${this.wadlBasePath}/base-resources`;
        return this.http.get<SparqlResponse>(url);
    }

    /**
     * Get all existing (sub) resources
     * @returns A SparqlResponse object with all existing services with their base resource, base path and service path
     */
    getResources(): Observable<SparqlResponse> {
        const url = `${this.wadlBasePath}/resources`;
        return this.http.get<SparqlResponse>(url);
    }

    getResourcesByBase(baseIri: string): Observable<SparqlResponse> {
        const queryParam = {
            baseResource: baseIri
        };
        const url = `${this.wadlBasePath}/resources`;
        return this.http.get<SparqlResponse>(url, {params: queryParam});
    }
    /**
     * Get all existing methods
     * @returns A SparqlResponse object with all existing methods with their base resource, base path and service path
     */
    getMethods(): Observable<SparqlResponse> {
        const url = `${this.wadlBasePath}/methods`;
        return this.http.get<SparqlResponse>(url);
    }

    /**
     * Get all response codes
     * @returns A SparqlResponse object with all response codes that may be retrieved as a reponse
     */
    getResponseCodes(): Observable<SparqlResponse> {
        const url = `${this.wadlBasePath}/response-codes`;
        return this.http.get<SparqlResponse>(url);
    }

    /**
     * Get all parameter types
     * @returns A SparqlResponse object with all parameter types that can be used to send parameters via HTTP
     */
    getParameterTypes(): Observable<SparqlResponse> {
        const url = `${this.wadlBasePath}/parameter-types`;
        return this.http.get<SparqlResponse>(url);
    }


    getRequestParameters(baseResourceIri: string, resourceIri: string, methodTypeIri: string, parameterTypeIri:string): Observable<SparqlResponse> {
        const url = `${this.wadlBasePath}/request-parameters`;
        const queryParams = {
            baseResourceIri: baseResourceIri,
            resourceIri: resourceIri,
            methodTypeIri: methodTypeIri,
            parameterTypeIri: parameterTypeIri
        };
        return this.http.get<SparqlResponse>(url, {params: queryParams});
    }

    getRequestRepresentation(resourceIri: string, methodTypeIri: string) {
        const encodedResourceIri = encodeURIComponent(resourceIri);
        const encodedMethodTypeIri = encodeURIComponent(methodTypeIri);
        const url = `${this.wadlBasePath}/${encodedResourceIri}/${encodedMethodTypeIri}/request-representation`;
        return this.http.get<SparqlResponse>(url);
    }


    public loadTABLE_OF_RESPONSE_REPRESENTATION(serviceIRI, methodIRI) {
        return this.query.SPARQL_SELECT_TABLE(this.wadlData.SELECT_TABLE_OF_RESPONSE_REPRESENTATION(serviceIRI, methodIRI));
    }
    public loadLIST_ONTOLOGICAL_TYPES_BY_NAMESPACE(owlEntity) {
        return this.query.SPARQL_SELECT_LIST(this.wadlData.SELECT_LIST_ONTOLOGICAL_TYPES_BY_NAMESPACE(owlEntity), 0);
    }


    public async getBaseResourceInsertString(context: string) {
        // let insertString = "";
        // switch (context) {
        //     case 'baseResource':
        //         insertString = await this.createBaseResource();
        //         break;

        //     default:
        //         break;
        // }
        // const blobObserver = new Observable((observer) => {
        //     const insertString = await this.createBaseResource(baseResourcePath, baseResourceIri, serviceProviderIri);
        //     const blob = new Blob([insertString], { type: 'text/plain' });
        //     const name = 'insert.txt';
        //     this.downloadService.download(blob, name);
        //     observer.next();
        //     observer.complete();
        // });
        // return blobObserver;
    }

    public createBaseResource(baseResource: WadlBaseResource): Observable<void> {
        const url = `${this.wadlBasePath}/base-resources`;
        return this.http.post<void>(url, baseResource);
    }


    public deleteBaseResource(baseResourceIri: string): Observable<void> {
        const url = `${this.wadlBasePath}/base-resources/${baseResourceIri}`;
        return this.http.delete<void>(url);
    }

    public addResource(sD: WadlResource): Observable<void> {
        const url = `${this.wadlBasePath}/resources`;
        return this.http.post<void>(url, sD);
    }

    public deleteResource(resourceIri: string): Observable<void> {
        const url = `${this.wadlBasePath}/resources/${resourceIri}`;
        return this.http.delete<void>(url);
    }

    public getResourceInsertString(sD: WadlResource): Observable<string> {
        const blobObserver = new Observable<string>((observer) => {
            // TODO: Get insert string from backend
            const insertString = ""; //this.wadlInsert.createService(sD);
            const blob = new Blob([insertString], { type: 'text/plain' });
            const name = 'insert.txt';
            this.downloadService.download(blob, name);
            observer.next();
            observer.complete();
        });
        return blobObserver;
    }

    public addMethod(request: WadlMethod): Observable<void> {
        const url = `${this.wadlBasePath}/methods`;
        return this.http.post<void>(url, request);
    }


    // TODO: Pass proper variables object
    // public modifyRequest(variables: any, action: string) {
    //     const GRAPHS = this.graphs.getGraphs();
    //     const activeGraph = GRAPHS[this.graphs.getActiveGraph()];

    //     switch (action) {
    //     case "add": {
    //         return this.query.executeUpdate(this.wadlInsert.createRequest(variables, activeGraph));
    //     }
    //     case "delete": {
    //         return this.query.executeUpdate(this.wadlInsert.deleteRequest(variables));
    //     }
    //     case "build": {
    //         const blobObserver = new Observable((observer) => {
    //             const insertString = this.wadlInsert.createRequest(variables, activeGraph);
    //             const blob = new Blob([insertString], { type: 'text/plain' });
    //             const name = 'insert.txt';
    //             this.downloadService.download(blob, name);
    //             observer.next();
    //             observer.complete();
    //         });
    //         return blobObserver;
    //     }
    //     }
    // }

    public createResponse(method: WadlMethod, response: WadlResponse) {
        //     const optionals = {
        //         representation: `
        //             BIND(<${variables.bodyRepresentationIRI}> AS ?bodyRepresentation).
        //             BIND(<${variables.bodyRepresentationParameterIRI}> AS ?bodyRepresentationParameter).`,
        //         bodyParameterDataTypeNonOntological: `?bodyRepresentationParameter wadl:hasParameterType "${variables.bodyRepresentationParameterDataType}"^^xsd:string.`,
        //         bodyParameterDataTypeOntologicalABox: `?bodyRepresentationParameter wadl:hasOntologicalParameterType <${variables.bodyRepresentationParameterDataTypeOntologicalABox}>.`,
        //         bodyParameterDataTypeOntologicalTBox: `?bodyRepresentationParameter rdf:type <${variables.bodyRepresentationParameterDataTypeOntologicalTBox}>.`,
        //         representationOption: `BIND(<${variables.bodyRepresentationParameterOptionIRI}> AS ?bodyRepresentationParameterOption).`

        //     };

        //     // add a check for empties and if one is found delete the string
        //     for (const i in optionals) {
        //         const element = optionals[i];
        //         if (element.search(`undefined`) != -1) { optionals[i] = ""; }
        //         // console.log(element);
        //     }

        //     const insertString = `
        // PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        // PREFIX owl: <http://www.w3.org/2002/07/owl#>
        // PREFIX wadl: <http://www.hsu-ifa.de/ontologies/WADL#>
        // PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        // INSERT { GRAPH <${activeGraph}> {
        //   ?service wadl:hasMethod ?method.

        //   ?method rdf:type <${variables.methodTypeIRI}>;
        //        a owl:NamedIndividual;
        //               wadl:hasResponse ?response.

        //   ?response rdf:type wadl:Response;
        //     rdf:type <${variables.responseTypeIRI}>;
        //     a owl:NamedIndividual.

        //     # for representation
        //     ?response wadl:hasRepresentation ?bodyRepresentation.
        //     ?bodyRepresentation rdf:type wadl:Representation;
        //      a owl:NamedIndividual;
        //      wadl:hasMediaType "${variables.bodyRepresentationMediaType}";
        //      wadl:hasParameter ?bodyRepresentationParameter.
        //      ${optionals.bodyParameterDataTypeNonOntological}
        //      ${optionals.bodyParameterDataTypeOntologicalTBox}
        //      ${optionals.bodyParameterDataTypeOntologicalABox}

        //     ?bodyRepresentationParameter rdf:type wadl:Parameter;
        //      a owl:NamedIndividual;
        //      wadl:hasParameterName "${variables.bodyRepresentationParameterKey}"^^xsd:NMTOKEN;
        //      wadl:hasParameterOption ?bodyRepresentationParameterOption.


        //     ?bodyRepresentationParameterOption rdf:type wadl:Option;
        //      a owl:NamedIndividual;
        //      wadl:hasOptionValue "${variables.bodyRepresentationParameterOptionValue}"^^xsd:string.
        //     }

        //   } WHERE {
        //     BIND(<${variables.serviceIRI}> AS ?service).
        //     BIND(<${variables.methodIRI}> AS ?method).
        //     BIND(<${variables.responseIRI}> AS ?response).
        //     ${optionals.representation}
        //     ${optionals.representationOption}
        //   }`;
        //     console.log(insertString);
        //     return insertString;
        // }

        // return this.query.executeUpdate(this.wadlInsert.createResponse(variables, activeGraph));
    }

    addResponse(method: WadlMethod, response: WadlResponse): Observable<void> {
        return this.http.post<void>(this.wadlBasePath, null);
    }

    deleteResponse(response: WadlResponse): Observable<void> {
        return this.http.delete<void>(this.wadlBasePath);
    }

    createResponseInsertString(method: WadlMethod, response: WadlResponse): Observable<string> {
        return this.http.get<string>(this.wadlBasePath);
    }


    public deleteOption(variables: WADLVARIABLES) {
        return this.query.executeUpdate(this.wadlInsert.deleteOption(variables));
    }
    public deleteParameter(variables: WADLVARIABLES) {
        return this.query.executeUpdate(this.wadlInsert.deleteParameter(variables));
    }
}









export class WADLDATA {

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
