export interface DINEN61360Variables {
    mandatoryTypeVariables: MandatoryTypeVariables;
    optionalTypeVariables: OptionalTypeVariables;
    instanceVariables: InstanceVariables;
}

enum logicInterpretation { 
    "<" = "<", 
    "<=" = "<=", 
    "=" = "=", 
    ">" = ">", 
    ">=" = ">=" 
}

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