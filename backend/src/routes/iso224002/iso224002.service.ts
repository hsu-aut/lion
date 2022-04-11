import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SparqlService } from '../../shared-services/sparql.service';
import { ISO224002ElementVariables, ISO224002KPIVariables } from '@shared/interfaces/iso224002-variables.interface';
import { SparqlResponse } from '@shared/interfaces/sparql/SparqlResponse';

@Injectable()
export class ISO224002Service {

	iso224002Insert = new ISO224002Insert();
	iso224002Data = new ISO224002Data();
  
	constructor(
		private sparqlService: SparqlService,
	){}

	// get routes
	public getTableOfAllEntityInfo(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.iso224002Data.SELECT_TABLE_ALL_ENTITY_INFO);
	}
	public getListOfKPIGroups(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.iso224002Data.SELECT_LIST_OF_KPI_GROUPS);
	}
	public getListOfKPIs(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.iso224002Data.SELECT_LIST_OF_KPIs);
	}
	public getListOfOrganizationalElements(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.iso224002Data.SELECT_LIST_OF_ORGANIZATIONAL_ELEMENTS);
	}
	public getListOfNonOrganizationalElements(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.iso224002Data.SELECT_LIST_OF_NON_ORGANIZATIONAL_ELEMENTS);
	}
	public getListOfElementGroups(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.iso224002Data.SELECT_LIST_OF_ELEMENT_GROUPS);
	}
	public getListOfOrganizationalElementClasses(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.iso224002Data.SELECT_LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES);
	}
	public getTableOfElements(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.iso224002Data.SELECT_TABLE_ELEMENTS);
	}
	public getTableOfKPIs(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.iso224002Data.SELECT_TABLE_KPI);
	}
	public getListOfElementsByGroup(groupNameIRI: string): Observable<SparqlResponse> {
		return this.sparqlService.query(this.iso224002Data.SELECT_LIST_OF_ELEMENTS_BY_GROUP(groupNameIRI));
	}
	public getListOfClassConstraintEnum(kpiClass: string, constrainingDataProperty: string): Observable<SparqlResponse> {
		return this.sparqlService.query(this.iso224002Data.SELECT_LIST_OF_CLASS_CONSTRAINT_ENUM(kpiClass, constrainingDataProperty));
	}

	// post routes
	public buildElement(elementVariables: ISO224002ElementVariables, activeGraph: string): Observable<void> {
		return this.sparqlService.update(this.iso224002Insert.createElement(elementVariables, activeGraph));
	}
	public buildKPI (kpiVariables: ISO224002KPIVariables, activeGraph: string): Observable<void> {
		return this.sparqlService.update(this.iso224002Insert.createKPI(kpiVariables, activeGraph));
	}
	public getElementBuildString(elementVariables: ISO224002ElementVariables, activeGraph: string): string {
		return this.iso224002Insert.createElement(elementVariables, activeGraph);
	}
	public getKPIBuildString(kpiVariables: ISO224002KPIVariables, activeGraph: string): string {
		return this.iso224002Insert.createKPI(kpiVariables, activeGraph);
	}

}

// TODO: this can be a normal helper method, no additional class needed
class ISO224002Data {

	public SELECT_LIST_OF_KPIs: string  = `
	PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	PREFIX owl: <http://www.w3.org/2002/07/owl#>
  
	SELECT ?Element
	WHERE {
		 ?Element a ISO:KeyPerformanceIndicator.
	}
	`
  
	public SELECT_LIST_OF_ORGANIZATIONAL_ELEMENTS: string  = `
	PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	PREFIX owl: <http://www.w3.org/2002/07/owl#>
  
	SELECT ?Element
	WHERE {
		 ?Element a ISO:OrganizationalTerms.
	}
	`
  
	public SELECT_LIST_OF_NON_ORGANIZATIONAL_ELEMENTS: string  = `
	PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	PREFIX owl: <http://www.w3.org/2002/07/owl#>
  
	SELECT ?Element
	WHERE {
		 ?Element a ISO:Elements.
	  MINUS {?Element a ISO:OrganizationalTerms.}
	}
	`
  
	public SELECT_LIST_OF_ELEMENT_GROUPS: string  = `
	PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
  
	SELECT ?ISO_Elements
	WHERE {
	 ?ISO_Elements sesame:directSubClassOf ISO:Elements.
	 FILTER (?ISO_Elements != ISO:OrganizationalTerms)
	}`
  
	public SELECT_LIST_OF_KPI_GROUPS: string  = `
	PREFIX ISO: <http://www.hsu-ifa.de/ontologies/ISO22400-2#>
  
	SELECT ?ISO_KPIs
	WHERE {
	 ?ISO_KPIs sesame:directSubClassOf ISO:KeyPerformanceIndicator.
	}`
  
	public SELECT_LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES: string  = `
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
  
	public SELECT_TABLE_ALL_ENTITY_INFO: string  = `
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
	public SELECT_TABLE_ELEMENTS: string  = `
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
	public SELECT_TABLE_KPI: string = `
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
  	public SELECT_LIST_OF_ELEMENTS_BY_GROUP(groupNameIRI: string): string {
  
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
  
	public SELECT_LIST_OF_CLASS_CONSTRAINT_ENUM(KPI_Class: string, ConstrainingDataProperty: string): string {
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

// TODO: this can be a normal helper method, no additional class needed
class ISO224002Insert {
  
	  public createElement(simpleElementVariables: ISO224002ElementVariables, activeGraph: string) {
  
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
	  public createKPI(KPIVariables: ISO224002KPIVariables, activeGraph: string) {
  
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
  