export class BaseResourceDefinition {

    constructor(
        public baseResourcePath: string,
        public baseResourceIri: string,
        public serviceProviderIri: string
    ) {}
}