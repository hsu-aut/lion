// Simple util class holding DIN EN 61360 queries
export class DINEN61360Data {

	public SELECT_TABLE_ALL_TYPE_INFO = `
	PREFIX DE6: <http://www.w3id.org/hsu-aut/DINEN61360#>
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
	}`
  
	public SELECT_TABLE_ALL_INSTANCE_INFO = `
	PREFIX DE6: <http://www.w3id.org/hsu-aut/DINEN61360#>
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
	PREFIX DE6: <http://www.w3id.org/hsu-aut/DINEN61360#>
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
	PREFIX DE6: <http://www.w3id.org/hsu-aut/DINEN61360#>
	SELECT DISTINCT ?enum
	WHERE {
  
	DE6:Expression_Goal rdfs:range ?RangeBlankNode.
	?RangeBlankNode owl:oneOf ?oneOfBlankNode.
		?oneOfBlankNode rdf:rest* ?restBlankNode.
		?restBlankNode rdf:first ?enum.
  
	}`

	public SELECT_LIST_DATA_TYPES = `
	PREFIX DE6: <http://www.w3id.org/hsu-aut/DINEN61360#>
	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	SELECT DISTINCT ?dataType WHERE { 
			  
	  ?simpleDataType sesame:directSubClassOf DE6:Simple_Data_Type.
	  ?complexDataType sesame:directSubClassOf DE6:Complex_Data_Type.
		{BIND(?simpleDataType AS ?dataType).}UNION
		{BIND(?complexDataType AS ?dataType).}
	}`
  
	public SPARQL_SELECT_allDE = `
	PREFIX DE6: <http://www.w3id.org/hsu-aut/DINEN61360#>
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	SELECT ?DE  WHERE { 
	?DE a DE6:Data_Element.  
  	}`
  
  
	public SPARQL_SELECT_allDET = `
	PREFIX DE6: <http://www.w3id.org/hsu-aut/DINEN61360#>
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	SELECT ?DET  WHERE { 
	?DET a DE6:Type_Description.  
	}`

	public SPARQL_SELECT_allDEI = `
	PREFIX DE6: <http://www.w3id.org/hsu-aut/DINEN61360#>
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	SELECT ?DEI  WHERE { 
	?DEI a DE6:Instance_Description.  
  	}`
  
}