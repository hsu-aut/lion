import { WadlRequest } from "./WadlRequest";
import { WadlResponse } from "./WadlResponse";

export class WadlMethod {
    methodIri: string;

    constructor(
        public resourceIri: string,
        public methodTypeIri: string,
        public request?: WadlRequest,
        public response?: WadlResponse
    ) {
        this.methodIri = `${resourceIri}_${methodTypeIri.split("#")[1]}`;
    }
}