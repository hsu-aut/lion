import { Injectable } from '@angular/core';

import { PrefixesService } from '../../shared/services/prefixes.service';
import { QueriesService } from '../../shared/services/backEnd/queries.service';
import { GraphOperationsService } from '../../shared/services/backEnd/graphOperations.service';
import { DataLoaderService } from '../../shared/services/dataLoader.service';
import { DownloadService } from '../../shared/services/backEnd/download.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Dinen61360Service {

  private TABLE_ALL_TYPE_INFO = [];
  private TABLE_ALL_INSTANCE_INFO = [];

  private LIST_DATA_TYPES = [];
  private LIST_All_DE = [];
  private LIST_All_DET = [];
  private LIST_All_DEI = [];
  private LIST_LOGIC_INTERPRETATIONS = [];
  private LIST_EXPRESSION_GOALS = [];

  dinen61360data = new DINEN61360Data();
  dinen61360insert = new DINEN61360Insert();

  constructor(
    private query: QueriesService,
    private graphs: GraphOperationsService,
    private nameService: PrefixesService,
    private loadingScreenService: DataLoaderService,
    private dlService: DownloadService
  ) {

    this.initializeDINEN61360();

  }

  public initializeDINEN61360() {
    this.loadTABLE_All_TYPES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.TABLE_ALL_TYPE_INFO = data;
    });
    this.loadLIST_All_DE().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_All_DE = data;
    });
    this.loadLIST_All_DEI().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_All_DEI = data;
    });
    this.loadLIST_All_DET().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_All_DET = data;
    });
    this.loadLIST_DATA_TYPES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_DATA_TYPES = data;
    });
    this.loadTABLE_ALL_INSTANCE_INFO().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.TABLE_ALL_INSTANCE_INFO = data;
    });
    this.loadLIST_EXPRESSION_GOALS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_EXPRESSION_GOALS = data;
    });
    this.loadLIST_LOGIC_INTERPRETATIONS().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.LIST_LOGIC_INTERPRETATIONS = data;
    });
  }

  public loadTABLE_All_TYPES() {
    this.loadingScreenService.startLoading();
    return this.query.SPARQL_SELECT_TABLE(this.dinen61360data.SELECT_TABLE_ALL_TYPE_INFO);
  }
  public loadLIST_All_DE() {
    this.loadingScreenService.startLoading();
    return this.query.SPARQL_SELECT_LIST(this.dinen61360data.SPARQL_SELECT_allDE, 0);
  }
  public loadLIST_All_DEI() {
    this.loadingScreenService.startLoading();
    return this.query.SPARQL_SELECT_LIST(this.dinen61360data.SPARQL_SELECT_allDEI, 0);
  }
  public loadLIST_All_DET() {
    this.loadingScreenService.startLoading();
    return this.query.SPARQL_SELECT_LIST(this.dinen61360data.SPARQL_SELECT_allDET, 0);
  }
  public loadLIST_DATA_TYPES() {
    this.loadingScreenService.startLoading();
    return this.query.SPARQL_SELECT_LIST(this.dinen61360data.SELECT_LIST_DATA_TYPES, 0);
  }
  public loadLIST_LOGIC_INTERPRETATIONS() {
    this.loadingScreenService.startLoading();
    return this.query.SPARQL_SELECT_LIST(this.dinen61360data.SELECT_LIST_LOGIC_INTERPRETATIONS, 0);
  }
  public loadLIST_EXPRESSION_GOALS() {
    this.loadingScreenService.startLoading();
    return this.query.SPARQL_SELECT_LIST(this.dinen61360data.SELECT_LIST_EXPRESSION_GOALS, 0);
  }
  public loadTABLE_ALL_INSTANCE_INFO() {
    this.loadingScreenService.startLoading();
    return this.query.SPARQL_SELECT_TABLE(this.dinen61360data.SELECT_TABLE_ALL_INSTANCE_INFO);
  }


  public setTABLE_All_TYPES(table) {
    this.TABLE_ALL_TYPE_INFO = table;
  }
  public setTABLE_ALL_INSTANCE_INFO(table) {
    this.TABLE_ALL_INSTANCE_INFO = table;
  }
  public setLIST_All_DE(list) {
    this.LIST_All_DE = list;
  }
  public setLIST_All_DET(list) {
    this.LIST_All_DET = list;
  }
  public setLIST_All_DEI(list) {
    this.LIST_All_DEI = list;
  }


  public getTABLE_All_TYPES() { return this.TABLE_ALL_TYPE_INFO }
  public getLIST_All_DE() { return this.LIST_All_DE }
  public getLIST_All_DET() { return this.LIST_All_DET }
  public getLIST_All_DEI() { return this.LIST_All_DEI }
  public getLIST_DATA_TYPES() { return this.LIST_DATA_TYPES }
  public getTABLE_ALL_INSTANCE_INFO() { return this.TABLE_ALL_INSTANCE_INFO }
  public getLIST_EXPRESSION_GOALS() { return this.LIST_EXPRESSION_GOALS }
  public getLIST_LOGIC_INTERPRETATIONS() { return this.LIST_LOGIC_INTERPRETATIONS }

  public modifyInstance(action: string, variables: DINEN61360Variables) {
    var GRAPHS = this.graphs.getGraphs();
    var activeGraph = GRAPHS[this.graphs.getActiveGraph()];

    switch (action) {
      case "add": {
        return this.query.SPARQL_UPDATE(this.dinen61360insert.buildDINEN61360I(variables, activeGraph));
      }
      case "delete": {
        console.log("not implemented yet")
        break;
      }
      case "build": {
        var blobObserver = new Observable((observer) => {
          let insertString = this.dinen61360insert.buildDINEN61360I(variables, activeGraph);
          const blob = new Blob([insertString], { type: 'text/plain' });
          const name = 'insert.txt';
          this.dlService.download(blob, name);
          observer.next();
          observer.complete();
        });
        return blobObserver;
      }
    }
  }
  public modifyType(action: string, variables: DINEN61360Variables) {
    var GRAPHS = this.graphs.getGraphs();
    var activeGraph = GRAPHS[this.graphs.getActiveGraph()];

    switch (action) {
      case "add": {
        return this.query.SPARQL_UPDATE(this.dinen61360insert.buildDINEN61360T(variables, activeGraph));
      }
      case "delete": {
        console.log("not implemented yet")
        break;
      }
      case "build": {
        var blobObserver = new Observable((observer) => {
          let insertString = this.dinen61360insert.buildDINEN61360T(variables, activeGraph);
          const blob = new Blob([insertString], { type: 'text/plain' });
          const name = 'insert.txt';
          this.dlService.download(blob, name);
          observer.next();
          observer.complete();
        });
        return blobObserver;
      }
    }

  }
  public insertDET(variables: DINEN61360Variables) {
    var PREFIXES = this.nameService.getPrefixes();
    var namespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

    var GRAPHS = this.graphs.getGraphs();
    var activeGraph = GRAPHS[this.graphs.getActiveGraph()];

    return this.query.SPARQL_UPDATE(this.dinen61360insert.buildDINEN61360T(variables, activeGraph));
  }
  public buildDET(variables: DINEN61360Variables) {
    var PREFIXES = this.nameService.getPrefixes();
    var namespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

    var GRAPHS = this.graphs.getGraphs();
    var activeGraph = GRAPHS[this.graphs.getActiveGraph()];

    return this.dinen61360insert.buildDINEN61360T(variables, activeGraph);
  }
  public insertDEI(variables: DINEN61360Variables) {
    var PREFIXES = this.nameService.getPrefixes();
    var namespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

    var GRAPHS = this.graphs.getGraphs();
    var activeGraph = GRAPHS[this.graphs.getActiveGraph()];

    return this.query.SPARQL_UPDATE(this.dinen61360insert.buildDINEN61360I(variables, activeGraph));
  }
  public buildDEI(variables: DINEN61360Variables) {
    var PREFIXES = this.nameService.getPrefixes();
    var namespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

    var GRAPHS = this.graphs.getGraphs();
    var activeGraph = GRAPHS[this.graphs.getActiveGraph()];

    return this.dinen61360insert.buildDINEN61360I(variables, activeGraph);
  }

}

export class DINEN61360Data {
  public IRI: Array<String>;

  public SELECT_TABLE_ALL_TYPE_INFO = `
  PREFIX DE6: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  SELECT DISTINCT ?type ?code ?revision ?version ?preferredName ?shortName ?definition ?unitOfMeasure ?dataType WHERE { 
            
  ?type a DE6:Type_Description.
  OPTIONAL{ ?type DE6:Code ?code.}
  OPTIONAL{ ?type DE6:Definition ?definition.}
  OPTIONAL{ ?type DE6:Unit_of_Measure ?unitOfMeasure.}
  OPTIONAL{ ?type DE6:Revision_Number ?revision.}
  OPTIONAL{ ?type DE6:Version_Number ?version.}
  OPTIONAL{ ?type DE6:Short_Name ?shortName.}
  OPTIONAL{ ?type DE6:Preferred_Name ?preferredName.}
  OPTIONAL{ ?type a ?dataType.
              ?dataType rdfs:subClassOf ?a.
              VALUES ?a
              {DE6:Array DE6:Bag DE6:List DE6:Set DE6:Boolean DE6:Integer DE6:Real DE6:String}}
  }   `;

  public SELECT_TABLE_ALL_INSTANCE_INFO = `
  PREFIX DE6: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  SELECT DISTINCT ?individual ?instance ?instanceLabel ?type ?expressionGoal ?logicInterpretation ?value WHERE { 
  
  ?individual DE6:has_Data_Element ?DE.
  ?DE DE6:has_Instance_Description ?instance.
  ?instance a DE6:Instance_Description;
       DE6:Instance_Description_has_Type ?type;
            rdfs:label ?instanceLabel;
            DE6:Expression_Goal ?expressionGoal;
            DE6:Logic_Interpretation ?logicInterpretation;
            DE6:Value ?value.

  }`
  public SELECT_LIST_LOGIC_INTERPRETATIONS = `
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX DE6: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
  SELECT DISTINCT ?enum
  WHERE {

  DE6:Logic_Interpretation rdfs:range ?RangeBlankNode.
  ?RangeBlankNode owl:oneOf ?oneOfBlankNode.
    ?oneOfBlankNode rdf:rest* ?restBlankNode.
    ?restBlankNode rdf:first ?enum.

  }`
  public SELECT_LIST_EXPRESSION_GOALS = `
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX DE6: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
  SELECT DISTINCT ?enum
  WHERE {

  DE6:Expression_Goal rdfs:range ?RangeBlankNode.
  ?RangeBlankNode owl:oneOf ?oneOfBlankNode.
      ?oneOfBlankNode rdf:rest* ?restBlankNode.
      ?restBlankNode rdf:first ?enum.

  }
  `
  public SELECT_LIST_DATA_TYPES = `
  PREFIX DE6: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  SELECT DISTINCT ?dataType WHERE { 
            
    ?simpleDataType sesame:directSubClassOf DE6:Simple_Data_Type.
    ?complexDataType sesame:directSubClassOf DE6:Complex_Data_Type.
      {BIND(?simpleDataType AS ?dataType).}UNION
      {BIND(?complexDataType AS ?dataType).}
  }
  `

  public SPARQL_SELECT_allDE = `
  PREFIX DE6: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  SELECT ?DE  WHERE { 
  ?DE a DE6:Data_Element.  
}  
  `;


  public SPARQL_SELECT_allDET = `
  PREFIX DE6: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  SELECT ?DET  WHERE { 
  ?DET a DE6:Type_Description.  
}  
  `;
  public SPARQL_SELECT_allDEI = `
  PREFIX DE6: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  SELECT ?DEI  WHERE { 
  ?DEI a DE6:Instance_Description.  
} 
  `;


}

export enum expressionGoal { Actual_Value = "Actual_Value", Assurance = "Assurance", Requirement = "Requirement" }
export enum logicInterpretation { "<" = "<", "<=" = "<=", "=" = "=", ">" = ">", ">=" = ">=" }
// export enum datatype { Boolean = "Boolean", Integer = "Integer", Real = "Real", String = "String", Array = "Array", Bag = "Bag", List = "List", Set = "Set" }

class InstanceVariables {
  code: string;
  expressionGoalString: string;
  logicInterpretationString: logicInterpretation;
  valueString: string;
  describedIndividual: string;
}

class MandatoryTypeVariables {
  typeIRI: string;
  code: string;
  version: string;
  revision: string;
  preferredName: string;
  shortName: string;
  definition: string;
  unitOfMeasure: string;
  dataTypeIRI: string;
}
class OptionalTypeVariables {
  Synonymous_Name: string;
  backwards_compatible_Revision: string;
  backwards_compatible_Version: string;
  Value_Format_Field_length: string;
  Value_Format_Field_length_Variable: string;
  Value_Format_non_quantitativ: string;
  Value_Format_quantitativ: string;
  Value_List: string;
  Value_List_Member: string;
  Source_Document_of_Definition: string;
  Synonymous_Letter_Symbol: string;
  Note: string;
  Remark: string;
  Preferred_Letter_Symbol: string;
  Formula: string;
  Drawing_Reference: string;
}


export class DINEN61360Variables {
  mandatoryTypeVariables: MandatoryTypeVariables;
  optionalTypeVariables: OptionalTypeVariables;
  instanceVariables: InstanceVariables;

}

export class DINEN61360Insert {

  public buildDINEN61360T(variables: DINEN61360Variables, activeGraph: string) {

    var optionals = {
      boundSynonymous_Name: `BIND(STR("${variables.optionalTypeVariables.Synonymous_Name}") AS ?Synonymous_Name).`,
      boundbackwards_compatible_Revision: `BIND(STR("${variables.optionalTypeVariables.backwards_compatible_Revision}") AS ?backwards_compatible_Revision).`,
      boundbackwards_compatible_Version: `BIND(STR("${variables.optionalTypeVariables.backwards_compatible_Version}") AS ?backwards_compatible_Version).`,
      boundValue_Format_Field_length: `BIND(STR("${variables.optionalTypeVariables.Value_Format_Field_length}") AS ?Value_Format_Field_length).`,
      boundValue_Format_Field_length_Variable: `BIND(STR("${variables.optionalTypeVariables.Value_Format_Field_length_Variable}") AS ?Value_Format_Field_length_Variable).`,
      boundValue_Format_non_quantitativ: `BIND(STR("${variables.optionalTypeVariables.Value_Format_non_quantitativ}") AS ?Value_Format_non_quantitativ).`,
      boundValue_Format_quantitativ: `BIND(STR("${variables.optionalTypeVariables.Value_Format_quantitativ}") AS ?Value_Format_quantitativ).`,
      boundValue_List: `BIND(STR("${variables.optionalTypeVariables.Value_List}") AS ?Value_List).`,
      boundValue_List_Member: `BIND(STR("${variables.optionalTypeVariables.Value_List_Member}") AS ?Value_List_Member).`,
      boundSource_Document_of_Definition: `BIND(STR("${variables.optionalTypeVariables.Source_Document_of_Definition}") AS ?Source_Document_of_Definition).`,
      boundSynonymous_Letter_Symbol: `BIND(STR("${variables.optionalTypeVariables.Synonymous_Letter_Symbol}") AS ?Synonymous_Letter_Symbol).`,
      boundNote: `BIND(STR("${variables.optionalTypeVariables.Note}") AS ?Note).`,
      boundRemark: `BIND(STR("${variables.optionalTypeVariables.Remark}") AS ?Remark).`,
      boundPreferred_Letter_Symbol: `BIND(STR("${variables.optionalTypeVariables.Preferred_Letter_Symbol}") AS ?Preferred_Letter_Symbol).`,
      boundFormula: `BIND(STR("${variables.optionalTypeVariables.Formula}") AS ?Formula).`,
      boundDrawing_Reference: `BIND(STR("${variables.optionalTypeVariables.Drawing_Reference}") AS ?Drawing_Reference).`,
      boundUnitOfMeasure: `BIND(STR("${variables.mandatoryTypeVariables.unitOfMeasure}") AS ?Unit_of_Measure).`,
    }

    // add a check for empties and if one is found delete the string
    for (const i in optionals) {

      const element = optionals[i];
      if (element.search(`undefined`) != -1) { optionals[i] = "" }
      // console.log(element);
    }

    var insertString = `
# DINEN61360_INSERT_SIMPLE with UUID bindings
# Necessary W3C ontologies
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

# Necessary SemAnz40 standard ontologies
PREFIX DE6: <http://www.hsu-ifa.de/ontologies/DINEN61360#>

INSERT {
  GRAPH <${activeGraph}>{
    # Declaration of individuals

  ?DE_TypeIRI rdf:type DE6:Type_Description;											    # Definition of DE Type Description
      a owl:NamedIndividual;
      rdf:type ?DataTypeIRI;
      rdfs:label ?DET_Label.
            

    
    # Declaration of DataProperties for the DE Type Description
      #non optional
    ?DE_TypeIRI DE6:Code ?Code;
      DE6:Version_Number ?Version_Number;
      DE6:Revision_Number ?Revision_Number;
      DE6:Preferred_Name ?Preferred_Name;
      DE6:Short_Name ?Short_Name;
      DE6:Definition ?Definition;
        
        #optional
      DE6:Synonymous_Name ?Synonymous_Name;
      DE6:backwards_compatible_Revision ?backwards_compatible_Revision;
    DE6:backwards_compatible_Version ?backwards_compatible_Version;
      DE6:Value_Format_Field_length ?Value_Format_Field_length;
      DE6:Value_Format_Field_length_Variable ?Value_Format_Field_length_Variable;
      DE6:Value_Format_non-quantitativ ?Value_Format_non_quantitativ;
      DE6:Value_Format_quantitativ ?Value_Format_quantitativ;
      DE6:Value_List ?Value_List;
      DE6:Value_List_Member ?Value_List_Member;
      DE6:Source_Document_of_Definition ?Source_Document_of_Definition;
      DE6:Synonymous_Letter_Symbol ?Synonymous_Letter_Symbol;
      DE6:Note ?Note;
      DE6:Remark ?Remark;
      DE6:Preferred_Letter_Symbol ?Preferred_Letter_Symbol;
      DE6:Formula ?Formula;
      DE6:Drawing_Reference ?Drawing_Reference;
      
        #case-dependent
      DE6:Unit_of_Measure ?Unit_of_Measure.
      }                                 
  
} WHERE {

  { SELECT 

      # Data Element type
      ?DE_TypeIRI

      # Labels
      ?DET_Label 

      # data element type description attributes
      ?DataTypeIRI ?Code ?Version_Number ?Revision_Number ?Preferred_Name ?Short_Name ?Definition ?Synonymous_Name ?backwards_compatible_Revision ?backwards_compatible_Version 
      ?Value_Format_Field_length ?Value_Format_Field_length_Variable ?Value_Format_non_quantitativ ?Value_Format_quantitativ ?Value_List ?Value_List_Member 
      ?Source_Document_of_Definition ?Synonymous_Letter_Symbol ?Note ?Remark ?Preferred_Letter_Symbol ?Formula ?Drawing_Reference ?Unit_of_Measure 

  WHERE
    {    
      # CHANGES TO THIS PART ALWAYS REQUIRED
           
          #non optional
          BIND(STR("${variables.mandatoryTypeVariables.code}") AS ?Code).
          BIND(STR("${variables.mandatoryTypeVariables.version}") AS ?Version_Number).
          BIND(STR("${variables.mandatoryTypeVariables.revision}") AS ?Revision_Number).
          BIND(STR("${variables.mandatoryTypeVariables.preferredName}") AS ?Preferred_Name).
          BIND(STR("${variables.mandatoryTypeVariables.shortName}") AS ?Short_Name).
          BIND(STR("${variables.mandatoryTypeVariables.definition}") AS ?Definition).
          #optional
          ${optionals.boundSynonymous_Name}
          ${optionals.boundbackwards_compatible_Revision}
          ${optionals.boundbackwards_compatible_Version}
          ${optionals.boundValue_Format_Field_length}
          ${optionals.boundValue_Format_Field_length_Variable}
          ${optionals.boundValue_Format_non_quantitativ}
          ${optionals.boundValue_Format_quantitativ}
          ${optionals.boundValue_List}
          ${optionals.boundValue_List_Member}
          ${optionals.boundSource_Document_of_Definition}
          ${optionals.boundSynonymous_Letter_Symbol}
          ${optionals.boundNote}
          ${optionals.boundRemark}
          ${optionals.boundPreferred_Letter_Symbol}
          ${optionals.boundFormula}
          ${optionals.boundDrawing_Reference}
          ${optionals.boundUnitOfMeasure}

      # ----------------------------------------------------------------- #
      # NO CHANGES TO THIS PART EVER
      # Defines the general namespace for all individuals
      BIND(?Preferred_Name AS ?DET_Label).
      BIND(<${variables.mandatoryTypeVariables.typeIRI}> AS ?DE_TypeIRI).
      BIND(<${variables.mandatoryTypeVariables.dataTypeIRI}> AS ?DataTypeIRI).
    }
  }
  }`
    return insertString
  }

  public buildDINEN61360I(variables: DINEN61360Variables, activeGraph: string) {

    var optionals = {
      boundExpressionGoal: `BIND(STR("${variables.instanceVariables.expressionGoalString}") AS ?Expression_Goal).`,
      boundLogicInterpretation: `BIND(STR("${variables.instanceVariables.logicInterpretationString}") AS ?Logic_Interpretation).`

    }

    // add a check for empties and if one is found delete the string
    for (const i in optionals) {

      const element = optionals[i];
      if (element.search(`undefined`) != -1) { optionals[i] = "" }
      // console.log(element);
    }
    for (const i in optionals) {

      const element = optionals[i];
      if (element.search(`null`) != -1) { optionals[i] = "" }
      // console.log(element);
    }

    var insertString = `
# DINEN61360_INSERT_SIMPLE with UUID bindings
# Necessary W3C ontologies
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

# Necessary SemAnz40 standard ontologies
PREFIX DE6: <http://www.hsu-ifa.de/ontologies/DINEN61360#>

INSERT {
  GRAPH <${activeGraph}>{
    # Declaration of individuals
  ?DE_uuid rdf:type DE6:Data_Element;													# Definition of Data Element (DE)
      a owl:NamedIndividual;
      rdfs:label ?DE_Label.
  ?DE_Instance_uuid rdf:type DE6:Instance_Description;								# Definition of DEÃ‚Â´s Instance Description
      a owl:NamedIndividual;
      rdfs:label ?DEI_Label.

    
    # Declaration of ObjectProperties
    ?DE_uuid DE6:has_Instance_Description ?DE_Instance_uuid;								# OP b from DE to type and instance
      DE6:has_Type_Description ?DE_TypeIRI. 
    ?DE_TypeIRI DE6:Type_Description_has_Instance ?DE_Instance_uuid.						# OP from type to instance and data type
              
      # Defines the individual to connect the data element to
      ?DescribedIndividualIRI DE6:has_Data_Element ?DE_uuid.
          
    # Declaration of DataProperties for the DEÃ‚Â´s Instance description
    ?DE_Instance_uuid DE6:Expression_Goal ?Expression_Goal;								# Enumeration {"Actual_Value" , "Assurance" , "Requirement"}
      DE6:Logic_Interpretation ?Logic_Interpretation;										# Enumeration {"<" , "<=" , "=" , ">" , ">="}
      DE6:Value ?Value;
    DE6:Created_at_Date ?Created_at_Date.  									            # Time stamp format  CCYY-MM-DDThh:mm:ss
  }                             
  
} WHERE {

  { SELECT 
      #Individual that is described by the data element
      ?DescribedIndividualIRI

      # uuids for data element, data element instance, data element data type
      ?DE_uuid ?DE_Instance_uuid 

      # Data Element type
      ?DE_TypeIRI

      # Labels
      ?DE_Label ?DEI_Label

      # data element instance description attributes
      ?Expression_Goal ?Logic_Interpretation ?Created_at_Date

      # value
      ?Value

  WHERE
    {    
      # CHANGES TO THIS PART ALWAYS REQUIRED

      # Define the individual to be described by the data element
      BIND(<${variables.instanceVariables.describedIndividual}> AS ?DescribedIndividualIRI).
     
      # Define the data element instance attributes
      ${optionals.boundExpressionGoal}
      ${optionals.boundLogicInterpretation}
  
      # Define the value to use
      BIND(STR("${variables.instanceVariables.valueString}") AS ?Value).
      
      BIND(STR("${variables.instanceVariables.code}") AS ?Code).
      ?DE_TypeIRI DE6:Code ?Code;
      rdfs:label ?DET_Label.

      # ----------------------------------------------------------------- #
      # NO CHANGES TO THIS PART EVER
      BIND(CONCAT(?DET_Label,"_Data_Element") AS ?DE_Label).
      BIND(CONCAT(?DET_Label,"_Instance") AS ?DEI_Label).
      BIND(NOW() AS ?Created_at_Date).
      BIND(UUID() AS ?DE_uuid).
      BIND(UUID() AS ?DE_Instance_uuid).
    }
  }

}`
    return insertString

  }


}