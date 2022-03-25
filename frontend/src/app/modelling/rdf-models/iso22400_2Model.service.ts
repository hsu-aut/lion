import { Injectable } from '@angular/core';
import { PrefixesService } from '../../shared/services/prefixes.service';
import { QueriesService } from '../../shared/services/backEnd/queries.service';
import { GraphOperationsService } from '../../shared/services/backEnd/graphOperations.service';
import { DataLoaderService } from '../../shared/services/dataLoader.service';
import { DownloadService } from '../../shared/services/backEnd/download.service';
import { MessagesService } from '../../shared/services/messages.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Iso22400_2ModelService {

  isoData = new ISO22400_2DATA();
  isoInsert = new ISO22400_2INSERT();

  private LIST_OF_ELEMENT_GROUPS = [];
  private LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES = [];
  private LIST_OF_KPIs = [];
  private LIST_OF_KPI_GROUPS = [];
  private LIST_OF_ORGANIZATIONAL_ELEMENTS = [];
  private LIST_OF_NON_ORGANIZATIONAL_ELEMENTS = [];
  private LIST_OF_CLASS_CONSTRAINT_ENUM = [];
  private TABLE_ALL_ENTITY_INFO = [];
  private TABLE_ELEMENTS = [];
  private TABLE_KPI = [];

  constructor(
    private query: QueriesService,
    private downloadService: DownloadService,
    private nameService: PrefixesService,
    private messageService: MessagesService,
    private loadingScreenService: DataLoaderService,
    private graphs: GraphOperationsService
  ) {

      this.initializeISO22400_2();

  }

  initializeISO22400_2() {
      this.loadLIST_OF_ELEMENT_GROUPS().pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.LIST_OF_ELEMENT_GROUPS = data;
      });
      this.loadLIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES().pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES = data;
      });
      this.loadLIST_OF_KPIs().pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.LIST_OF_KPIs = data;
      });
      this.loadLIST_OF_ORGANIZATIONAL_ELEMENTS().pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.LIST_OF_ORGANIZATIONAL_ELEMENTS = data;
      });
      this.loadLIST_OF_NON_ORGANIZATIONAL_ELEMENTS().pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.LIST_OF_NON_ORGANIZATIONAL_ELEMENTS = data;
      });
      this.loadLIST_OF_KPI_GROUPS().pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.LIST_OF_KPI_GROUPS = data;
      });
      this.loadTABLE_ALL_ENTITY_INFO().pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.TABLE_ALL_ENTITY_INFO = data;
      });
      this.loadTABLE_ELEMENTS().pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.TABLE_ELEMENTS = data;
      });
      this.loadTABLE_KPI().pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.TABLE_KPI = data;
      });
  }

  // loaders
  public loadLIST_OF_KPI_GROUPS() {
      this.loadingScreenService.startLoading();
      return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_KPI_GROUPS, 0);
  }
  public loadTABLE_ALL_ENTITY_INFO() {
      this.loadingScreenService.startLoading();
      return this.query.SPARQL_SELECT_TABLE(this.isoData.SELECT_TABLE_ALL_ENTITY_INFO);
  }
  public loadLIST_OF_KPIs() {
      this.loadingScreenService.startLoading();
      return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_KPIs, 0);
  }
  public loadLIST_OF_ORGANIZATIONAL_ELEMENTS() {
      this.loadingScreenService.startLoading();
      return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_ORGANIZATIONAL_ELEMENTS, 0);
  }
  public loadLIST_OF_NON_ORGANIZATIONAL_ELEMENTS() {
      this.loadingScreenService.startLoading();
      return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_NON_ORGANIZATIONAL_ELEMENTS, 0);
  }
  public loadLIST_OF_ELEMENT_GROUPS() {
      this.loadingScreenService.startLoading();
      return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_ELEMENT_GROUPS, 0);
  }
  public loadLIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES() {
      this.loadingScreenService.startLoading();
      return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES, 0);
  }

  public loadLIST_OF_ELEMENTS_BY_GROUP(groupNameIRI: string) {
      this.loadingScreenService.startLoading();
      groupNameIRI = this.nameService.parseToIRI(groupNameIRI);
      return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_ELEMENTS_BY_GROUP(groupNameIRI), 0);
  }
  public loadLIST_OF_CLASS_CONSTRAINT_ENUM(KPI_Class: string, ConstrainingDataProperty: string) {
      this.loadingScreenService.startLoading();
      KPI_Class = this.nameService.parseToIRI(KPI_Class);
      console.log(KPI_Class);
      ConstrainingDataProperty = this.nameService.parseToIRI(ConstrainingDataProperty);
      console.log(ConstrainingDataProperty);
      return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_CLASS_CONSTRAINT_ENUM(KPI_Class, ConstrainingDataProperty), 0);
  }
  public loadTABLE_ELEMENTS(){
      this.loadingScreenService.startLoading();
      return this.query.SPARQL_SELECT_TABLE(this.isoData.SELECT_TABLE_ELEMENTS);
  }
  public loadTABLE_KPI(){
      this.loadingScreenService.startLoading();
      return this.query.SPARQL_SELECT_TABLE(this.isoData.SELECT_TABLE_KPI);
  }


  // getters
  public getTABLE_ALL_ENTITY_INFO() {return this.TABLE_ALL_ENTITY_INFO;}
  public getLIST_OF_KPI_GROUPS() {return this.LIST_OF_KPI_GROUPS;}
  public getLIST_OF_KPIs() {return this.LIST_OF_KPIs;}
  public getLIST_OF_ORGANIZATIONAL_ELEMENTS() {return this.LIST_OF_ORGANIZATIONAL_ELEMENTS;}
  public getLIST_OF_NON_ORGANIZATIONAL_ELEMENTS() {return this.LIST_OF_NON_ORGANIZATIONAL_ELEMENTS;}
  public getLIST_OF_ELEMENT_GROUPS() {return this.LIST_OF_ELEMENT_GROUPS;}
  public getLIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES() {return this.LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES;}
  public getTABLE_ELEMENTS(){return this.TABLE_ELEMENTS;}
  public getTABLE_KPI(){return this.TABLE_KPI;}

  // setters
  public setTABLE_ALL_ENTITY_INFO(table) {this.TABLE_ALL_ENTITY_INFO = table;}
  public setLIST_OF_KPIs(list) {this.LIST_OF_KPIs = list;}
  public setLIST_OF_ORGANIZATIONAL_ELEMENTS(list) {this.LIST_OF_ORGANIZATIONAL_ELEMENTS = list;}
  public setLIST_OF_NON_ORGANIZATIONAL_ELEMENTS(list) {this.LIST_OF_NON_ORGANIZATIONAL_ELEMENTS = list;}
  public setTABLE_ELEMENTS(table) {this.TABLE_ELEMENTS = table;}
  public setTABLE_KPI(table) {this.TABLE_KPI = table;}

  // builders
  public createElement(variables: elementVariables, action: string) {
      const GRAPHS = this.graphs.getGraphs();
      const activeGraph = GRAPHS[this.graphs.getActiveGraph()];

      switch (action) {
      case "add": {
          return this.query.executeUpdate(this.isoInsert.createElement(variables, activeGraph));
      }
      case "delete": {
          this.messageService.addMessage('warning', 'Sorry!', 'This feature has not been implemented yet');
          break;
      }
      case "build": {
          const blobObserver = new Observable((observer) => {
              const insertString = this.isoInsert.createElement(variables, activeGraph);
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
  public createKPI(KPIVariables: KPIVariables, action: string) {
      const GRAPHS = this.graphs.getGraphs();
      const activeGraph = GRAPHS[this.graphs.getActiveGraph()];

      switch (action) {
      case "add": {
          return this.query.executeUpdate(this.isoInsert.createKPI(KPIVariables, activeGraph));
      }
      case "delete": {
          this.messageService.addMessage('warning', 'Sorry!', 'This feature has not been implemented yet');
          break;
      }
      case "build": {
          const blobObserver = new Observable((observer) => {
              const insertString = this.isoInsert.createKPI(KPIVariables, activeGraph);
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
}

export class ISO22400_2DATA {

  public SELECT_LIST_OF_KPIs = `
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>

  SELECT ?Element
  WHERE {
       ?Element a ISO:KeyPerformanceIndicator.
  }
  `

  public SELECT_LIST_OF_ORGANIZATIONAL_ELEMENTS = `
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>

  SELECT ?Element
  WHERE {
       ?Element a ISO:OrganizationalTerms.
  }
  `

  public SELECT_LIST_OF_NON_ORGANIZATIONAL_ELEMENTS = `
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>

  SELECT ?Element
  WHERE {
   	?Element a ISO:Elements.
    MINUS {?Element a ISO:OrganizationalTerms.}
  }
  `

  public SELECT_LIST_OF_ELEMENT_GROUPS = `
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>

  SELECT ?ISO_Elements
  WHERE {
   ?ISO_Elements sesame:directSubClassOf ISO:Elements.
   FILTER (?ISO_Elements != ISO:OrganizationalTerms)
  }`

  public SELECT_LIST_OF_KPI_GROUPS = `
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>

  SELECT ?ISO_KPIs
  WHERE {
   ?ISO_KPIs sesame:directSubClassOf ISO:KeyPerformanceIndicator.
  }`

  public SELECT_LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES = `
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>

  SELECT ?ISO_Elements
  WHERE {
      BIND(IRI("http://www.hsu-ifa.de/ontologies/ISO22400-2#OrganizationalTerms") AS ?Group)
       ?ISO_Elements rdfs:subClassOf ?Group.
      FILTER (?ISO_Elements != owl:Nothing)
      FILTER (?ISO_Elements != ?Group)
      FILTER (?ISO_Elements != ISO:OperationCluster)
  }`

  public SELECT_TABLE_ALL_ENTITY_INFO = `
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

  SELECT ?Entity ?EntityType
  WHERE {
    ?Entity a ISO:OrganizationalTerms.
    ?Entity rdf:type ?EntityType.
    ?EntityType rdfs:subClassOf ISO:OrganizationalTerms.
    FILTER (?EntityType != ISO:OrganizationalTerms)
    FILTER (?EntityType != ISO:OperationCluster)
  }
  `
  public SELECT_TABLE_ELEMENTS = `
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  SELECT DISTINCT ?Entity ?Element ?Period ?Value ?UnitOfMeasure ?Duration
  WHERE {
  ?Entity ISO:hasElement ?Element;
          a owl:NamedIndividual.
  ?Element ISO:forPeriod ?Period.
  OPTIONAL{
      ?Element ISO:Value ?Value;
                 ISO:UnitOfMeasure ?UnitOfMeasure.}
  OPTIONAL{
      ?Element ISO:timeSpan ?Duration.}
  }
  `
  public SELECT_TABLE_KPI = `
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  SELECT DISTINCT ?Entity ?KPI ?Period ?Value ?UnitOfMeasure
  WHERE {
  ?Entity ISO:hasKeyPerformanceIndicator ?KPI;
          a owl:NamedIndividual.
  ?KPI ISO:forPeriod ?Period.

  ?KPI ISO:Value ?Value;
          ISO:UnitOfMeasure ?UnitOfMeasure.
  }
  `

  public SELECT_LIST_OF_ELEMENTS_BY_GROUP(groupNameIRI: string) {

      const selectString = `
   PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
   PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
   PREFIX owl: <http://www.w3.org/2002/07/owl#>

   SELECT ?ISO_Elements
   WHERE {
       BIND(IRI("${groupNameIRI}") AS ?Group)
        ?ISO_Elements rdfs:subClassOf ?Group.
       FILTER (?ISO_Elements != owl:Nothing)
       FILTER (?ISO_Elements != ?Group)
       FILTER (?ISO_Elements != ISO:OperationCluster)
   }`;
      return selectString;
  }

  public SELECT_LIST_OF_CLASS_CONSTRAINT_ENUM(KPI_Class: string, ConstrainingDataProperty: string) {
      const selectString = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT DISTINCT ?ConstraintEnum
    WHERE {
        <${KPI_Class}> rdfs:subClassOf ?OnPropertyBlankNode.
        ?OnPropertyBlankNode owl:onProperty <${ConstrainingDataProperty}>.
        <${ConstrainingDataProperty}> a owl:DatatypeProperty.
        OPTIONAL {
          ?OnPropertyBlankNode ?anyOwl ?someValuesFromBlankNode.
          ?someValuesFromBlankNode owl:oneOf ?oneOfBlankNode.
          ?oneOfBlankNode rdf:first ?ConstraintEnum.
        }
        OPTIONAL {
          ?OnPropertyBlankNode ?anyOwl ?someValuesFromBlankNode.
          ?someValuesFromBlankNode owl:unionOf ?unionBlankNode.
          ?unionBlankNode rdf:rest* ?restBlankNode.
          ?restBlankNode rdf:first ?firstBlankNode.
          ?firstBlankNode owl:oneOf ?oneOfBlankNode.
          ?oneOfBlankNode rdf:first ?ConstraintEnum.
        }
    }`;
      return selectString;
  }

}

export class ISO22400_2VARIABLES {
  simpleElement: elementVariables
  KPI: KPIVariables
}



export class ISO22400_2INSERT {

    public createElement(simpleElementVariables: elementVariables, activeGraph: string) {

        const value = simpleElementVariables.simpleValue;
        const duration = simpleElementVariables.duration;
        const UnitOfMeasure = simpleElementVariables.UnitOfMeasure;
        const relevantPeriod = simpleElementVariables.relevantPeriod;
        const entityIRI = simpleElementVariables.entityIRI;
        const entityClass = simpleElementVariables.entityClass;
        const elementIRI = simpleElementVariables.elementIRI;
        const elementClass = simpleElementVariables.elementClass;

        const optionals = {
            nonTimeElement: `?newElement  ISO:Value "${value}"^^xsd:string;
                                    ISO:UnitOfMeasure "${UnitOfMeasure}"^^xsd:string.`,
            timeElement: `?newElement ISO:timeSpan "${duration}"^^xsd:duration.`,

        };

        // add a check for empties and if one is found delete the string
        for (const i in optionals) {

            const element = optionals[i];
            if (element.search(`null`) != -1) { optionals[i] = ""; }
        }
        for (const i in optionals) {

            const element = optionals[i];
            if (element.search(`undefined`) != -1) { optionals[i] = ""; }
        }

        const insertString = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    INSERT {

    GRAPH <${activeGraph}>{

    ?entity ISO:hasElement ?newElement;
            rdf:type ?IsoUnit;
            a owl:NamedIndividual.
    ?newElement rdf:type ?elementClass;
            a owl:NamedIndividual.
    ?newElement ISO:forPeriod "${relevantPeriod}"^^xsd:dateTimeStamp.

    #        optional, depending on whether it is a time element or not
    ${optionals.nonTimeElement}
    ${optionals.timeElement}

        }
    } WHERE {
        BIND(IRI(STR("${entityIRI}")) AS ?entity).
        BIND(IRI(STR("${entityClass}")) AS ?IsoUnit).
        BIND(IRI(STR("${elementIRI}")) AS ?newElement).
        BIND(IRI(STR("${elementClass}")) AS ?elementClass).
    }
    `;
        console.log(insertString);
        return insertString;
    }
    public createKPI(KPIVariables: KPIVariables, activeGraph: string) {

        const value = KPIVariables.simpleValue;
        const entityIRI = KPIVariables.entityIRI;
        const entityClass = KPIVariables.entityClass;
        const KPI_IRI = KPIVariables.KPI_IRI;
        const KPI_Class = KPIVariables.KPI_Class;
        const KPI_Timing = KPIVariables.timing;
        const relevantPeriod = KPIVariables.relevantPeriod;
        const UnitOfMeasure = KPIVariables.UnitOfMeasure;

        const optionals = {
            nonTimeElement: `?newKPI  ISO:Value "${value}"^^xsd:string;
                                    ISO:UnitOfMeasure "${UnitOfMeasure}"^^xsd:string.`,
        };

        // add a check for empties and if one is found delete the string
        for (const i in optionals) {

            const element = optionals[i];
            if (element.search(`null`) != -1) { optionals[i] = ""; }
        }
        for (const i in optionals) {

            const element = optionals[i];
            if (element.search(`undefined`) != -1) { optionals[i] = ""; }
        }

        const insertString = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    INSERT {

    GRAPH <${activeGraph}>{

    ?entity ISO:hasKeyPerformanceIndicator ?newKPI;
            rdf:type ?IsoUnit;
            a owl:NamedIndividual.
    ?newKPI rdf:type ?KPI_Class;
            a owl:NamedIndividual;
            ISO:Timing "${KPI_Timing}"^^xsd:string.
    ?newKPI ISO:forPeriod "${relevantPeriod}"^^xsd:dateTimeStamp.

    #        optional, depending on whether it is a time element or not
    ${optionals.nonTimeElement}

        }
    } WHERE {
        BIND(IRI(STR("${entityIRI}")) AS ?entity).
        BIND(IRI(STR("${entityClass}")) AS ?IsoUnit).
        BIND(IRI(STR("${KPI_IRI}")) AS ?newKPI).
        BIND(IRI(STR("${KPI_Class}")) AS ?KPI_Class).
    }
    `;
        console.log(insertString);
        return insertString;
    }

}

class elementVariables {
  entityIRI: string;
  entityClass: string;
  elementIRI: string;
  elementClass: string;
  relevantPeriod: string;
  UnitOfMeasure: string;
  simpleValue: string;
  duration: string;
}

class KPIVariables {
  entityIRI: string;
  entityClass: string;
  KPI_IRI: string;
  KPI_Class: string;
  timing: string;
  relevantPeriod: string;
  UnitOfMeasure: string;
  simpleValue: string;
}
