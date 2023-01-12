import { Injectable } from '@angular/core';
import { QueriesService } from '../../../shared/services/backEnd/queries.service';
import { GraphOperationsService } from '../../../shared/services/backEnd/graphOperations.service';
import { DownloadService } from '../../../shared/services/backEnd/download.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { WadlBaseResource } from '@shared/models/odps/wadl/BaseResource';
import { WadlResource } from '@shared/models/odps/wadl/Resource';
import { WadlMethod } from '@shared/models/odps/wadl/WadlMethod';
import { WadlCreateResponseDto, WadlResponse, WadlResponseDto } from '@shared/models/odps/wadl/WadlResponse';
import { WadlCreateRequestDto, WadlRequest, WadlRequestDto } from '../../../../../models/odps/wadl/WadlRequest';
import { WadlParameter } from '../../../../../models/odps/wadl/WadlParameter';
import { WadlRepresentation } from '../../../../../models/odps/wadl/WadlRepresentation';


@Injectable({
    providedIn: 'root'
})
export class WadlModelService {

    baseUrl = "lion_BE/wadl"

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
        const url = `${this.baseUrl}/base-resources`;
        return this.http.get<SparqlResponse>(url);
    }

    /**
     * Get all existing (sub) resources
     * @returns A SparqlResponse object with all existing services with their base resource, base path and service path
     */
    getResources(): Observable<SparqlResponse> {
        const url = `${this.baseUrl}/resources`;
        return this.http.get<SparqlResponse>(url);
    }

    getResourcesByBase(baseIri: string): Observable<SparqlResponse> {
        const queryParam = {
            baseResource: baseIri
        };
        const url = `${this.baseUrl}/resources`;
        return this.http.get<SparqlResponse>(url, {params: queryParam});
    }

    /**
     * Get all existing methods
     * @returns A SparqlResponse object with all existing methods with their base resource, base path and service path
     */
    getMethods(): Observable<SparqlResponse> {
        const url = `${this.baseUrl}/methods`;
        return this.http.get<SparqlResponse>(url);
    }

    /**
     * Get all response codes
     * @returns A SparqlResponse object with all response codes that may be retrieved as a reponse
     */
    getResponseCodes(): Observable<SparqlResponse> {
        const url = `${this.baseUrl}/response-codes`;
        return this.http.get<SparqlResponse>(url);
    }

    addRequest(request: WadlCreateRequestDto): Observable<WadlRequestDto> {
        const url = `${this.baseUrl}/requests`;
        return this.http.post<WadlRequestDto>(url, request);
    }

    getRequest(resourceIri: string, methodTypeIri: string): Observable<WadlRequest> {
        const url = `${this.baseUrl}/requests`;
        const queryParams = {
            resourceIri: resourceIri,
            methodTypeIri: methodTypeIri,
        };
        return this.http.get<WadlRequest>(url, {params: queryParams});
    }

    /**
     * Get all parameter types
     * @returns A SparqlResponse object with all parameter types that can be used to send parameters via HTTP
     */
    getParameterTypes(): Observable<SparqlResponse> {
        const url = `${this.baseUrl}/parameter-types`;
        return this.http.get<SparqlResponse>(url);
    }

    /**
     * Returns all existing parameters of a parent element (either a request or response)
     * @param parentIri IRI of the parent element (request or response)
     * @returns
     */
    getExistingParameters(parentIri: string): Observable<WadlParameter[]> {
        const url = `${this.baseUrl}/parameters`;
        const queryParams = {
            parentIri: parentIri,
        };
        return this.http.get<WadlParameter[]>(url, {params: queryParams});
    }

    getRepresentations(parentIri: string) {
        const url = `${this.baseUrl}/representations`;
        const params = new HttpParams().append("parentIri", parentIri);
        return this.http.get<SparqlResponse>(url, {params: params});
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
        const url = `${this.baseUrl}/base-resources`;
        return this.http.post<void>(url, baseResource);
    }


    public deleteBaseResource(baseResourceIri: string): Observable<void> {
        const url = `${this.baseUrl}/base-resources/${baseResourceIri}`;
        return this.http.delete<void>(url);
    }

    public addResource(sD: WadlResource): Observable<void> {
        const url = `${this.baseUrl}/resources`;
        return this.http.post<void>(url, sD);
    }

    public deleteResource(resourceIri: string): Observable<void> {
        const url = `${this.baseUrl}/resources/${resourceIri}`;
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
        const url = `${this.baseUrl}/methods`;
        return this.http.post<void>(url, request);
    }

    public addParameter(parameter: WadlParameter): Observable<void> {
        const url = `${this.baseUrl}/parameters`;
        return this.http.post<void>(url, parameter);
    }

    public deleteParameter(parameterIri: string): Observable<void> {
        const encodedIri = encodeURIComponent(parameterIri);
        const url = `${this.baseUrl}/parameters/${encodedIri}`;
        return this.http.delete<void>(url);
    }

    public addRepresentation(rep: WadlRepresentation): Observable<void> {
        const url = `${this.baseUrl}/representations`;
        return this.http.post<void>(url, rep);
    }

    public addResponse(response: WadlCreateResponseDto): Observable<WadlResponseDto> {
        const url = `${this.baseUrl}/responses`;
        return this.http.post<WadlResponseDto>(url, response);
    }

    deleteResponse(response: WadlResponse): Observable<void> {
        return this.http.delete<void>(this.baseUrl);
    }

    createResponseInsertString(method: WadlMethod, response: WadlResponse): Observable<string> {
        return this.http.get<string>(this.baseUrl);
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
