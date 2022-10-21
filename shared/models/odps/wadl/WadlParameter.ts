export class WadlParameterDto {
	name: string;
	type: WadlParameterTypes;
	dataType: string;						// actual data type value (e.g. "string" or some IRI to an individual or class)
	typeOfDataType: WadlTypesOfDataTypes;	// simple data type, T-Box or A-Box?
	defaultValue?: any;
	required: boolean = false;
	options: WadlOption[] = new Array<WadlOption>()
}

export class WadlParameter {
	public parameterIri: string;
	public parameterType: WadlParameterTypes;
	constructor(
		public parentIri: string, // IRI of the parent request, response or representation
		public name: string,
		public type: WadlParameterTypes,
		public dataType: string,						// actual data type value (e.g. "string" or some IRI to an individual or class)
		public typeOfDataType: WadlTypesOfDataTypes,	// simple data type, T-Box or A-Box?
		public defaultValue?: any,
		public required: boolean = false,
		public options: WadlOption[] = new Array<WadlOption>()
	){
		this.parameterType = type;
		this.parameterIri = `${parentIri}_${name}`;
		this.options.forEach(op => {
			op.createIri(this.parameterIri);
		});
	}

	static fromDto(parentIri: string, paramDto: WadlParameterDto): WadlParameter {
		return new WadlParameter(parentIri, paramDto.name, paramDto.type, paramDto.dataType, paramDto.typeOfDataType, 
			paramDto.defaultValue, paramDto.required, paramDto.options);
	}

	toDto(): WadlParameterDto {
		return this;
	}
}


export class WadlOption {
	public iri: string;

	constructor(
		public value: string | number,
		public mediaType?: string
	){}

	/**
	 * Creates an IRI based on a parent (parameter) IRI
	 * @param parentIri IRI of the parent element, ususally a parameter
	 */
	createIri(parentIri: string) {
		this.iri = `${parentIri}_${this.value}`;
	}	
}

export enum WadlTypesOfDataTypes {
	"NonOntological",
	"ABox",
	"TBox"
}

export enum WadlParameterTypes {
	"http://www.hsu-ifa.de/ontologies/WADL#MatrixParameter",
	"http://www.hsu-ifa.de/ontologies/WADL#HeaderParameter",
	"http://www.hsu-ifa.de/ontologies/WADL#QueryParameter",
	"http://www.hsu-ifa.de/ontologies/WADL#TemplateParameter",
	"http://www.hsu-ifa.de/ontologies/WADL#PlainParameter"
}