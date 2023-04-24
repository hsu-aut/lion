import { WadlParameter, WadlParameterDto } from "./WadlParameter";
import { WadlRepresentation, WadlRepresentationDto } from "./WadlRepresentation";

export class WadlCreateResponseDto {
    constructor(
        public resourceIri: string,
        public methodTypeIri: string,
        public statusCode: string,
    ) {}
}

export class WadlResponseDto {

    constructor(
        public responseIri: string,
        public methodIri: string,
        public parameters = new Array<WadlParameterDto>(),
        public representations = new Array<WadlRepresentationDto>()) {}
}

export class WadlResponse extends WadlResponseDto {

    responseIri: string;

    static fromDto(resDto: WadlResponseDto): WadlResponse{
        const response = new WadlResponse(resDto.responseIri, resDto.methodIri, resDto.parameters, resDto.representations)
        return response;
    }

    addParameter(param: WadlParameter) {
        this.parameters.push(param);
    }

    addRepresentationParameter(param: WadlParameter, representationIri: string) {
        const representation = this.representations.find(rep => rep.representationIri === representationIri);
        if(!representation) return;
        
        representation.parameters.push(param);
    }
}

