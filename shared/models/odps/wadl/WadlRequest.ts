import { WadlOption, WadlParameter, WadlParameterTypes, WadlTypesOfDataTypes } from "./WadlParameter";
import { WadlRepresentation } from "./WadlRepresentation";

export class WadlCreateRequestDto {
    constructor(
        public resourceIri: string,
        public methodTypeIri: string,
        public parameters = new Array<WadlParameter>(),
        public representations = new Array<WadlRepresentation>()
    ) {}
}

export class WadlRequestDto {

    constructor(
        public requestIri: string,
        public methodIri: string,
        public parameters = new Array<WadlParameter>(),
        public representations = new Array<WadlRepresentation>()) {}
}

export class WadlRequest extends WadlRequestDto {
    requestIri: string;

    fromDto(reqDto: WadlRequestDto): WadlRequest {
        this.requestIri = reqDto.requestIri;
        this.methodIri = reqDto.methodIri;
        this.parameters = reqDto.parameters;
        this.representations = reqDto.representations;
        return this;
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