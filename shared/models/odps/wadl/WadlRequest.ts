import { WadlOption, WadlParameter, WadlParameterTypes, WadlTypesOfDataTypes } from "./WadlParameter";
import { WadlRepresentation } from "./WadlRepresentation";

export class WadlRequest {
    requestIri: string;

    constructor(
        public methodIri: string,
        public parameters = new Array<WadlParameter>(), // Requests can have both query or header parameters
        public representation?: WadlRepresentation, // According to WADL, there may be more than one representation
    ) {
        this.requestIri = `${methodIri}_Req`;
    }

    createParameter(name: string, paramType: WadlParameterTypes, typeOfDataType: WadlTypesOfDataTypes, datatype:string, defaultValue?: any, required?: boolean, options?: WadlOption[]) {
        const param = new WadlParameter(this.requestIri, name, paramType, typeOfDataType, datatype, defaultValue, required, options)
        return param;
    }

    addParameter(name: string, paramType: WadlParameterTypes, typeOfDataType: WadlTypesOfDataTypes, datatype:string, defaultValue?: any, required?: boolean, options?: WadlOption[]) {
        const param = this.createParameter(name, paramType, typeOfDataType, datatype, defaultValue, required, options);
        this.parameters.push(param);
    }

    addRepresentationParameter(name: string, paramType: WadlParameterTypes, typeOfDataType: WadlTypesOfDataTypes, datatype:string, defaultValue?: any, required?: boolean, options?: WadlOption[]) {
        if(!this.representation) {
            this.representation = new WadlRepresentation(this.requestIri)
        }
        const param = this.createParameter(name, paramType, typeOfDataType, datatype, defaultValue, required, options);
        this.representation.parameters.push(param);
    }
}