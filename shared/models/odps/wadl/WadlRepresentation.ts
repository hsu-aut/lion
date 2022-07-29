import { WadlParameter } from "./WadlParameter";

export class WadlRepresentation {
    public iri: string;
    
    constructor(
        public requestIri: string,
        public mediaType: string = "application/json",
        public parameters = new Array<WadlParameter>()
    ) {
            this.iri = `${this.requestIri}_Representation`
    }
}