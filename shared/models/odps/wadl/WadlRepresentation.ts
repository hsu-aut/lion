import { WadlParameter } from "./WadlParameter";

export class WadlRepresentation {
    public iri: string;
    
    constructor(
        public parentIri: string,
        public mediaType: string = "application/json",
        public parameters = new Array<WadlParameter>()
    ) {
            this.iri = `${this.parentIri}_Representation`
    }
}