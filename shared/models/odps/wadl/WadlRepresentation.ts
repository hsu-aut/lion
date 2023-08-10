import { WadlParameter, WadlParameterDto } from "./WadlParameter";

export class WadlRepresentationDto {
    public representationIri: string;
    public parentIri: string;
    public mediaType: string = "application/json";
    public parameters = new Array<WadlParameterDto>()
}


export class WadlRepresentation {
    public representationIri: string;
    
    constructor(
        public parentIri: string,
        public mediaType: string = "application/json",
        public parameters = new Array<WadlParameter>()
    ) {
            this.representationIri = `${this.parentIri}_Rep_${this.mediaType}`
    }

    static fromDto(repDto: WadlRepresentationDto): WadlRepresentation {
        const parameters = repDto.parameters.map(param => WadlParameter.fromDto(param))
		return new WadlRepresentation(repDto.parentIri, repDto.mediaType, parameters);
	}
}