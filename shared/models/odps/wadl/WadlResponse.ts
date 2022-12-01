import { WadlParameter } from "./WadlParameter";
import { WadlRepresentation } from "./WadlRepresentation";

export class WadlCreateResponseDto {
    constructor(
        public resourceIri: string,
        public methodTypeIri: string,
        public statusCode: string,
        public parameters = new Array<WadlParameter>(),
        public representations = new Array<WadlRepresentation>()
    ) {}
}

export class WadlResponseDto {

    constructor(
        public responseIri: string,
        public methodIri: string,
        public parameters = new Array<WadlParameter>(),
        public representations = new Array<WadlRepresentation>()) {}
}

export class WadlResponse extends WadlResponseDto {

    responseIri: string;

    fromDto(reqDto: WadlResponseDto): WadlResponse{
        this.responseIri = reqDto.responseIri;
        this.methodIri = reqDto.methodIri;
        this.parameters = reqDto.parameters;
        this.representations = reqDto.representations;
        return this;
    }

    addParameter(param: WadlParameter) {
        this.parameters.push(param);
    }

    addRepresentationParameter(param: WadlParameter, representationIri: string) {
        const representation = this.representations.find(rep => rep.iri === representationIri);
        if(!representation) return;
        
        representation.parameters.push(param);
    }
}

