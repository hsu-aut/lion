import { WadlParameter } from "./WadlParameter";

export class WadlResponse {

    constructor(
        public methodIri: string,
        public methodTypeIri: string,
        public parameters?: WadlParameter[]
    ) {}
}