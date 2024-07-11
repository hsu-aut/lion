import { Injectable } from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';
import { SparqlService } from '../../shared-services/sparql.service';
import { DINEN61360Variables } from '@shared/models/dinen61360-variables.interface';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { DINEN61360Data } from './DINEN61360Data';
import { GraphOperationService } from '../../shared-services/graph-operation.service';

@Injectable()
export class DINEN61360Service {

	dinen61360data = new DINEN61360Data();

	constructor(
		private sparqlService: SparqlService,
		private graphService: GraphOperationService
	){}

	public getAllTypes(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.dinen61360data.SELECT_TABLE_ALL_TYPE_INFO);
	}

	public getLogicInterpretations(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.dinen61360data.SELECT_LIST_LOGIC_INTERPRETATIONS);
	}

	public getAllDE(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.dinen61360data.SPARQL_SELECT_allDE);
	}

	public getAllDEI(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.dinen61360data.SPARQL_SELECT_allDEI);
	}

	public getAllDET(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.dinen61360data.SPARQL_SELECT_allDET);
	}
	
	public getDataTypes(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.dinen61360data.SELECT_LIST_DATA_TYPES);
	}

	public getAllInstanceInfo(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.dinen61360data.SELECT_TABLE_ALL_INSTANCE_INFO);
	}

	public getExpressionGoals(): Observable<SparqlResponse> {
		return this.sparqlService.query(this.dinen61360data.SELECT_LIST_EXPRESSION_GOALS);
	}
	
	public getTypeBuildString(variables: DINEN61360Variables): Observable<string> {
		return this.graphService.getCurrentGraph().pipe(switchMap(data => {
			const graphIri = data.graphIri;
			return this.getDINEN61360TypeString(variables, graphIri);
		}));
	}

	public getInstanceBuildString(variables: DINEN61360Variables): Observable<string> {
		return this.graphService.getCurrentGraph().pipe(switchMap(data => {
			const graphIri = data.graphIri;
			return this.getDINEN61360InstanceQuery(variables, graphIri);
		}));
	}

	public buildDINEN61360T(variables: DINEN61360Variables): Observable<void> {
		return this.graphService.getCurrentGraph().pipe(switchMap(data => {
			const graphIri = data.graphIri;
			return this.sparqlService.update(this.getDINEN61360TypeString(variables, graphIri));
		}));
	}

	public buildDINEN61360I(variables: DINEN61360Variables): Observable<void> {
		return this.graphService.getCurrentGraph().pipe(switchMap(data => {
			const graphIri = data.graphIri;
			return this.sparqlService.update(this.getDINEN61360InstanceQuery(variables, graphIri));
		}));
	}

	public getDINEN61360TypeString(variables: DINEN61360Variables, activeGraph: string): string {

		// TODO
		const optionals = {

			/* eslint-disable max-len */
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
			/* eslint-disable max-len */

		};

		// add a check for empties and if one is found delete the string
		for (const i in optionals) {

			const element = optionals[i];
			if (element.search(`undefined`) != -1) { optionals[i] = ""; }
			// console.log(element);

		}

		// !!! keep indentation, as tabs are inserted in template strings
		const insertString = `
# DINEN61360_INSERT_SIMPLE with UUID bindings
# Necessary W3C ontologies
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

# Necessary SemAnz40 standard ontologies
PREFIX DE6: <http://www.w3id.org/hsu-aut/DINEN61360#>

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
  }`;

		return insertString;

	}

	public getDINEN61360InstanceQuery(variables: DINEN61360Variables, activeGraph: string): string {

		const optionals = {

			boundExpressionGoal: `BIND(STR("${variables.instanceVariables.expressionGoalString}") AS ?Expression_Goal).`,
			boundLogicInterpretation: `BIND(STR("${variables.instanceVariables.logicInterpretationString}") AS ?Logic_Interpretation).`

		};

		// add a check for empties and if one is found delete the string
		for (const i in optionals) {

			const element = optionals[i];
			if (element.search(`undefined`) != -1) { optionals[i] = ""; }
			// console.log(element);

		}

		for (const i in optionals) {

			const element = optionals[i];
			if (element.search(`null`) != -1) { optionals[i] = ""; }
			// console.log(element);

		}
		// !!! keep indentation, as tabs are inserted in template strings
		const insertString = `
# DINEN61360_INSERT_SIMPLE with UUID bindings
# Necessary W3C ontologies
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

# Necessary SemAnz40 standard ontologies
PREFIX DE6: <http://www.w3id.org/hsu-aut/DINEN61360#>

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

}`;

		return insertString;

	}

}