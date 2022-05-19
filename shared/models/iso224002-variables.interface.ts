export interface ISO224002Variables {
    simpleElement: ISO224002ElementVariables
    KPI: ISO224002KPIVariables
  }

export interface ISO224002ElementVariables {
    entityIRI: string;
    entityClass: string;
    elementIRI: string;
    elementClass: string;
    relevantPeriod: string;
    UnitOfMeasure: string;
    simpleValue: string;
    duration: string;
}

export interface ISO224002KPIVariables {
    entityIRI: string;
    entityClass: string;
    KPI_IRI: string;
    KPI_Class: string;
    timing: string;
    relevantPeriod: string;
    UnitOfMeasure: string;
    simpleValue: string;
}