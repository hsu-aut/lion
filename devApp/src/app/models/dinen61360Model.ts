import {Namespace} from '../utils/prefixes';

var parser = new Namespace();

export class DINEN61360Data {
    public IRI: Array<String>;
    public SPARQL_SELECT_allTypes = `
    PREFIX DE6: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?Type ?ID ?Definition ?Unit_Of_Measure ?Data_Type WHERE { 
              
       ?Type a DE6:Type_Description;
       DE6:Code ?ID;
       DE6:Definition ?Definition;
       DE6:Unit_of_Measure ?Unit_Of_Measure;
       a ?Data_Type.
       ?Data_Type rdfs:subClassOf ?a.
          VALUES ?a
      {DE6:Simple_Data_Type DE6:Complex_Data_Type}
          }  `;
    public SPARQL_SELECT_physical_by_child = `
    PREFIX SA4: <http://www.hsu-ifa.de/ontologies/SemAnz40#>
    PREFIX SoA: <http://delicias.dia.fi.upm.es/ontologies/SimpleOrAggregated.owl#>
    PREFIX DE6: <http://www.hsu-ifa.de/ontologies/DINEN61360#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT ?SystemType ?ChildOfType ?ChildLabel ?SystemInstance ?InstanceLabel WHERE { 
        ?SystemType a SA4:System;
        SA4:has_Child ?ChildOfType.
        ?ChildOfType a SA4:System;
        rdfs:label ?ChildLabel;
        SA4:has_Child ?SystemInstance.
        ?SystemInstance a SoA:Object;
        rdfs:label ?InstanceLabel.
    }`;
    public SPARQL_SELECT_behavior = `
    PREFIX SA4: <http://www.hsu-ifa.de/ontologies/SemAnz40#>
    SELECT ?System WHERE { 
        ?System a SA4:Behavior.                   
    }  `;
}

export enum expressionGoal {Actual_Value = "Actual_Value" ,Assurance = "Assurance" ,Requirement = "Requirement"}
export enum logicInterpretation {"<" = "<" ,"<=" = "<=" , "=" =  "=" , ">" = ">" , ">=" = ">="}
export enum datatype {Boolean = "Boolean", Integer = "Integer",Real = "Real",String = "String",Array = "Array",Bag = "Bag",List = "List",Set = "Set"}

class InstanceVariables {
    expressionGoalString: string;
    logicInterpretationString: logicInterpretation;
    valueString: string; 
    describedIndividual: string;
}

class MandatoryTypeVariables {
    code: string;
    version: string;
    revision: string;
    preferredName: string;
    shortName: string;
    definition: string;
    unitOfMeasure: string;
    datatypeString: datatype
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

    public buildDINEN61360T(variables: DINEN61360Variables) {
        
        

        // individual to be described by data element

        // type info
        var code = variables.mandatoryTypeVariables.code
        var version = variables.mandatoryTypeVariables.version
        var revision = variables.mandatoryTypeVariables.revision
        var preferredName = variables.mandatoryTypeVariables.preferredName
        var shortName = variables.mandatoryTypeVariables.shortName
        var definition = variables.mandatoryTypeVariables.definition
        var datatype = variables.mandatoryTypeVariables.datatypeString

        // case dependent
        var unitOfMeasure = variables.mandatoryTypeVariables.unitOfMeasure;

        var Synonymous_Name = variables.optionalTypeVariables.Synonymous_Name
        var backwards_compatible_Revision = variables.optionalTypeVariables.backwards_compatible_Revision
        var backwards_compatible_Version = variables.optionalTypeVariables.backwards_compatible_Version
        var Value_Format_Field_length = variables.optionalTypeVariables.Value_Format_Field_length
        var Value_Format_Field_length_Variable = variables.optionalTypeVariables.Value_Format_Field_length_Variable
        var Value_Format_non_quantitativ = variables.optionalTypeVariables.Value_Format_non_quantitativ
        var Value_Format_quantitativ = variables.optionalTypeVariables.Value_Format_quantitativ
        var Value_List = variables.optionalTypeVariables.Value_List
        var Value_List_Member = variables.optionalTypeVariables.Value_List_Member
        var Source_Document_of_Definition = variables.optionalTypeVariables.Source_Document_of_Definition
        var Synonymous_Letter_Symbol = variables.optionalTypeVariables.Synonymous_Letter_Symbol
        var Note = variables.optionalTypeVariables.Note
        var Remark = variables.optionalTypeVariables.Remark
        var Preferred_Letter_Symbol = variables.optionalTypeVariables.Preferred_Letter_Symbol
        var Formula = variables.optionalTypeVariables.Formula
        var Drawing_Reference = variables.optionalTypeVariables.Drawing_Reference

        var optionals = {
            boundSynonymous_Name:                       `BIND(STR("${Synonymous_Name}") AS ?Synonymous_Name).`, 
            boundbackwards_compatible_Revision:         `BIND(STR("${backwards_compatible_Revision}") AS ?backwards_compatible_Revision).`,
            boundbackwards_compatible_Version:          `BIND(STR("${backwards_compatible_Version}") AS ?backwards_compatible_Version).`,
            boundValue_Format_Field_length:             `BIND(STR("${Value_Format_Field_length}") AS ?Value_Format_Field_length).`,
            boundValue_Format_Field_length_Variable:    `BIND(STR("${Value_Format_Field_length_Variable}") AS ?Value_Format_Field_length_Variable).`,
            boundValue_Format_non_quantitativ:          `BIND(STR("${Value_Format_non_quantitativ}") AS ?Value_Format_non_quantitativ).`,
            boundValue_Format_quantitativ:              `BIND(STR("${Value_Format_quantitativ}") AS ?Value_Format_quantitativ).`,
            boundValue_List:                            `BIND(STR("${Value_List}") AS ?Value_List).`,
            boundValue_List_Member:                     `BIND(STR("${Value_List_Member}") AS ?Value_List_Member).`,
            boundSource_Document_of_Definition:         `BIND(STR("${Source_Document_of_Definition}") AS ?Source_Document_of_Definition).`,
            boundSynonymous_Letter_Symbol:              `BIND(STR("${Synonymous_Letter_Symbol}") AS ?Synonymous_Letter_Symbol).`,
            boundNote:                                  `BIND(STR("${Note}") AS ?Note).`,
            boundRemark:                                `BIND(STR("${Remark}") AS ?Remark).`, 
            boundPreferred_Letter_Symbol:               `BIND(STR("${Preferred_Letter_Symbol}") AS ?Preferred_Letter_Symbol).`,
            boundFormula:                               `BIND(STR("${Formula}") AS ?Formula).`,
            boundDrawing_Reference:                     `BIND(STR("${Drawing_Reference}") AS ?Drawing_Reference).`,
        }
  
        // add a check for empties and if one is found delete the string
        for (const i in optionals) {
            
                const element = optionals[i];
                if (element.search(`undefined`) != -1) {optionals[i] = ""}
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
       
            BIND(STR("${datatype}") AS ?DataType).
        
            #non optional
            BIND(STR("${code}") AS ?Code).
            BIND(STR("${version}") AS ?Version_Number).
            BIND(STR("${revision}") AS ?Revision_Number).
            BIND(STR("${preferredName}") AS ?Preferred_Name).
            BIND(STR("${shortName}") AS ?Short_Name).
            BIND(STR("${definition}") AS ?Definition).
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
            #case-dependent
            BIND(STR("${unitOfMeasure}") AS ?Unit_of_Measure).

        # ----------------------------------------------------------------- #
        # NO CHANGES TO THIS PART EVER
        # Defines the general namespace for all individuals
        BIND(STR("http://www.hsu-ifa.de/ontologies/DINEN61360#") AS ?NameSpace).
        BIND(?Short_Name AS ?DET_Label).
        BIND(IRI(CONCAT(?NameSpace,?DET_Label)) AS ?DE_TypeIRI).
        BIND(IRI(CONCAT(?NameSpace,?DataType)) AS ?DataTypeIRI).
      }
    }

}      
        
        `
        return insertString    
    }

    public buildDINEN61360I(variables: DINEN61360Variables) {

// individual to be described by data element
var describedIRI = parser.parseToIRI(variables.instanceVariables.describedIndividual);


// type info
var code = variables.mandatoryTypeVariables.code

// instance info
var expressionGoal = variables.instanceVariables.expressionGoalString
var logicInterpretation = variables.instanceVariables.logicInterpretationString

var optionals = {
    boundExpressionGoal:              `BIND(STR("${expressionGoal}") AS ?Expression_Goal).`,    
    boundLogicInterpretation:         `BIND(STR("${logicInterpretation}") AS ?Logic_Interpretation).`

}

        // add a check for empties and if one is found delete the string
    for (const i in optionals) {
            
            const element = optionals[i];
            if (element.search(`undefined`) != -1) {optionals[i] = ""}
            // console.log(element);
    }


// value info
var value = variables.instanceVariables.valueString


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
        BIND(IRI(STR("${describedIRI}")) AS ?DescribedIndividualIRI).
       
        # Define the data element instance attributes
        ${optionals.boundExpressionGoal}
        ${optionals.boundLogicInterpretation}
    
        # Define the value to use
        BIND(STR("${value}") AS ?Value).
        
        BIND(STR("${code}") AS ?Code).
        ?DE_TypeIRI DE6:Code ?Code;
        rdfs:label ?DET_Label.

        # ----------------------------------------------------------------- #
        # NO CHANGES TO THIS PART EVER
        # Defines the general namespace for all individuals
        BIND(STR("http://www.hsu-ifa.de/ontologies/DINEN61360#") AS ?NameSpace).
        BIND(CONCAT(?DET_Label,"_Data_Element") AS ?DE_Label).
        BIND(CONCAT(?DET_Label,"_Instance") AS ?DEI_Label).
        BIND(NOW() AS ?Created_at_Date).
        BIND(UUID() AS ?DE_uuid).
        BIND(UUID() AS ?DE_Instance_uuid).
      }
    }

}
        `

        return insertString

    }

    public buildDINEN61360TnI(variables: DINEN61360Variables) {

        

        // individual to be described by data element
        var describedIRI = variables.instanceVariables.describedIndividual;

        // type info
        var code = variables.mandatoryTypeVariables.code
        var version = variables.mandatoryTypeVariables.version
        var revision = variables.mandatoryTypeVariables.revision
        var preferredName = variables.mandatoryTypeVariables.preferredName
        var shortName = variables.mandatoryTypeVariables.shortName
        var definition = variables.mandatoryTypeVariables.definition


        // instance info
        var expressionGoal = variables.instanceVariables.expressionGoalString
        var logicInterpretation = variables.instanceVariables.logicInterpretationString
        
        // value info
        var value = variables.instanceVariables.valueString
        var datatype = variables.mandatoryTypeVariables.datatypeString

        // case dependent
        var unitOfMeasure = variables.mandatoryTypeVariables.unitOfMeasure;

        var Synonymous_Name = variables.optionalTypeVariables.Synonymous_Name
        var backwards_compatible_Revision = variables.optionalTypeVariables.backwards_compatible_Revision
        var backwards_compatible_Version = variables.optionalTypeVariables.backwards_compatible_Version
        var Value_Format_Field_length = variables.optionalTypeVariables.Value_Format_Field_length
        var Value_Format_Field_length_Variable = variables.optionalTypeVariables.Value_Format_Field_length_Variable
        var Value_Format_non_quantitativ = variables.optionalTypeVariables.Value_Format_non_quantitativ
        var Value_Format_quantitativ = variables.optionalTypeVariables.Value_Format_quantitativ
        var Value_List = variables.optionalTypeVariables.Value_List
        var Value_List_Member = variables.optionalTypeVariables.Value_List_Member
        var Source_Document_of_Definition = variables.optionalTypeVariables.Source_Document_of_Definition
        var Synonymous_Letter_Symbol = variables.optionalTypeVariables.Synonymous_Letter_Symbol
        var Note = variables.optionalTypeVariables.Note
        var Remark = variables.optionalTypeVariables.Remark
        var Preferred_Letter_Symbol = variables.optionalTypeVariables.Preferred_Letter_Symbol
        var Formula = variables.optionalTypeVariables.Formula
        var Drawing_Reference = variables.optionalTypeVariables.Drawing_Reference

        var optionals = {
            boundSynonymous_Name:                       `BIND(STR("${Synonymous_Name}") AS ?Synonymous_Name).`, 
            boundbackwards_compatible_Revision:         `BIND(STR("${backwards_compatible_Revision}") AS ?backwards_compatible_Revision).`,
            boundbackwards_compatible_Version:          `BIND(STR("${backwards_compatible_Version}") AS ?backwards_compatible_Version).`,
            boundValue_Format_Field_length:             `BIND(STR("${Value_Format_Field_length}") AS ?Value_Format_Field_length).`,
            boundValue_Format_Field_length_Variable:    `BIND(STR("${Value_Format_Field_length_Variable}") AS ?Value_Format_Field_length_Variable).`,
            boundValue_Format_non_quantitativ:          `BIND(STR("${Value_Format_non_quantitativ}") AS ?Value_Format_non_quantitativ).`,
            boundValue_Format_quantitativ:              `BIND(STR("${Value_Format_quantitativ}") AS ?Value_Format_quantitativ).`,
            boundValue_List:                            `BIND(STR("${Value_List}") AS ?Value_List).`,
            boundValue_List_Member:                     `BIND(STR("${Value_List_Member}") AS ?Value_List_Member).`,
            boundSource_Document_of_Definition:         `BIND(STR("${Source_Document_of_Definition}") AS ?Source_Document_of_Definition).`,
            boundSynonymous_Letter_Symbol:              `BIND(STR("${Synonymous_Letter_Symbol}") AS ?Synonymous_Letter_Symbol).`,
            boundNote:                                  `BIND(STR("${Note}") AS ?Note).`,
            boundRemark:                                `BIND(STR("${Remark}") AS ?Remark).`, 
            boundPreferred_Letter_Symbol:               `BIND(STR("${Preferred_Letter_Symbol}") AS ?Preferred_Letter_Symbol).`,
            boundFormula:                               `BIND(STR("${Formula}") AS ?Formula).`,
            boundDrawing_Reference:                     `BIND(STR("${Drawing_Reference}") AS ?Drawing_Reference).`,
        }
  
        // add a check for empties and if one is found delete the string
        for (const i in optionals) {
            
                const element = optionals[i];
                if (element.search(`undefined`) != -1) {optionals[i] = ""}
                // console.log(element);
        }

        var insertString = `
        

# Necessary W3C ontologies
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

# Necessary SemAnz40 standard ontologies
PREFIX DE6: <http://www.hsu-ifa.de/ontologies/DINEN61360#>

# Individuals automatically created, so no naming required per query execution
# ?DE_uuid = a new data element
# ?DE_Instance_uuid = a new data element instance 
# ?DE_DataType_uuid = new data element´s data type

# Individuals to be set (watch namespaces to avoid undesired reasoning -> check beforehand, if Data Element Type already exists):
# DE_Type = Name of data element type 


INSERT {
    # Declaration of individuals
    ?DE_uuid rdf:type DE6:Data_Element;													# Definition of Data Element (DE)
    a owl:NamedIndividual;
    rdfs:label ?DE_Label.
    ?DE_Instance_uuid rdf:type DE6:Instance_Description;								# Definition of DEÂ´s Instance Description
    a owl:NamedIndividual;
    rdfs:label ?DEI_Label.
    ?DE_TypeIRI rdf:type DE6:Type_Description;											# Definition of DEÂ´s Type Description
    a owl:NamedIndividual;
    rdf:type ?DataTypeIRI;
    rdfs:label ?DET_Label.

    
    # Declaration of ObjectProperties
    ?DE_uuid DE6:has_Instance_Description ?DE_Instance_uuid;								# OP b from DE to type and instance
    DE6:has_Type_Description ?DE_TypeIRI. 
    ?DE_TypeIRI DE6:Type_Description_has_Instance ?DE_Instance_uuid.						# OP from type to instance and data type
            
    # Defines the individual to connect the data element to
    ?DescribedIndividualIRI DE6:has_Data_Element ?DE_uuid.
    
    # Declaration of DataProperties for the DEÂ´s Type description
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
    
    # Declaration of DataProperties for the DEÂ´s Instance description
    ?DE_Instance_uuid DE6:Expression_Goal ?Expression_Goal;								# Enumeration {"Actual_Value" , "Assurance" , "Requirement"}
    DE6:Logic_Interpretation ?Logic_Interpretation;										# Enumeration {"<" , "<=" , "=" , ">" , ">="}
    DE6:Value ?Value;
    DE6:Created_at_Date ?Created_at_Date.  									            # Time stamp format  CCYY-MM-DDThh:mm:ss

} WHERE {

    { SELECT 
        #Individual that is described by the data element
        ?DescribedIndividualIRI

        # uuids for data element, data element instance, data element data type
        ?DE_uuid ?DE_Instance_uuid 

        # Data Element type
        ?DE_TypeIRI

        # Labels
        ?DE_Label ?DEI_Label ?DET_Label 

        # data element type description attributes
        ?DataTypeIRI ?Code ?Version_Number ?Revision_Number ?Preferred_Name ?Short_Name ?Definition ?Synonymous_Name ?backwards_compatible_Revision ?backwards_compatible_Version 
        ?Value_Format_Field_length ?Value_Format_Field_length_Variable ?Value_Format_non_quantitativ ?Value_Format_quantitativ ?Value_List ?Value_List_Member 
        ?Source_Document_of_Definition ?Synonymous_Letter_Symbol ?Note ?Remark ?Preferred_Letter_Symbol ?Formula ?Drawing_Reference ?Unit_of_Measure 

        # data element instance description attributes
        ?Expression_Goal ?Logic_Interpretation ?Created_at_Date

        # value
        ?Value

    WHERE
      {    
        # CHANGES TO THIS PART ALWAYS REQUIRED

        # Define the individual to be described by the data element
        BIND(IRI(STR("${describedIRI}")) AS ?DescribedIndividualIRI).
       
        # Define the data element instance attributes
        BIND(STR("${expressionGoal}") AS ?Expression_Goal).                      # Enumeration {"Actual_Value" , "Assurance" , "Requirement"}
        BIND(STR("${logicInterpretation}") AS ?Logic_Interpretation).                            # Enumeration {"<" , "<=" , "=" , ">" , ">="}
    
        # Define the value to use
        BIND(STR("${value}") AS ?Value).
        BIND(STR("${datatype}") AS ?DataType).                                  # This INSERT pattern allows for "Boolean" "Integer" "Real" "String"
        

        # If data element type does not exist, define type description elements
        # Comment out things that should not be created
            #non optional
        BIND(STR("${code}") AS ?Code).
        BIND(STR("${version}") AS ?Version_Number).
        BIND(STR("${revision}") AS ?Revision_Number).
        BIND(STR("${preferredName}") AS ?Preferred_Name).
        BIND(STR("${shortName}") AS ?Short_Name).
        BIND(STR("${definition}") AS ?Definition).
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
            
        #case-dependent
        BIND(STR("${unitOfMeasure}") AS ?Unit_of_Measure).



        # ----------------------------------------------------------------- #
        # NO CHANGES TO THIS PART EVER
        # Defines the general namespace for all individuals
        BIND(STR("http://www.hsu-ifa.de/ontologies/DINEN61360#") AS ?NameSpace).
        BIND(?Short_Name AS ?DET_Label).
        BIND(IRI(CONCAT(?NameSpace,?DET_Label)) AS ?DE_TypeIRI).
        BIND(IRI(CONCAT(?NameSpace,?DataType)) AS ?DataTypeIRI).
        BIND(CONCAT(?DET_Label,"_Data_Element") AS ?DE_Label).
        BIND(CONCAT(?DET_Label,"_Instance") AS ?DEI_Label).
        BIND(NOW() AS ?Created_at_Date).
        BIND(UUID() AS ?DE_uuid).
        BIND(UUID() AS ?DE_Instance_uuid).
      }
    }

}`;
return insertString
    }

    
}