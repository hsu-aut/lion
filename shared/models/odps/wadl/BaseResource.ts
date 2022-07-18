import { SparqlResponse } from "../../sparql/SparqlResponse";
import { WadlResource } from "./Resource";

export class WadlBaseResource {

    resources = new Array<WadlResource>();

    constructor(
        public baseResourcePath: string,
        public baseResourceIri: string,
        public serviceProviderIri: string
    ) {}

    /**
     * Adds resources as sub-resources to this base resource
     */
    addSubResource(resourceIri: string, resourcePath: string) {
        const newResource = new WadlResource(this.baseResourceIri, resourcePath, resourceIri);
        this.resources.push(newResource);
    }

    static fromSparqlResult(response: SparqlResponse): WadlBaseResource[] {
        const bindings = response.results.bindings;
    
        // Filter to get unique values by taking advantage of the fact that sparql results are ordered.
        // If an entry is equivalent to the previous one, we can skip it
        const baseResources = bindings.filter((v,i,a)=> {
            if (i==0 || a[i].baseResource.value != a[i-1].baseResource.value) return v;
        }).map(entry => {
            return new WadlBaseResource(entry.basePath.value, entry.baseResource.value, entry.serviceProvider.value)
        })

        baseResources.forEach(baseResource => {
            const baseResourceEntries = bindings.filter(b => b.baseResource.value == baseResource.baseResourceIri);
            baseResourceEntries.forEach(b => {
                if(b.resource && b.resourcePath) {
                    baseResource.addSubResource(b.resource.value, b.resourcePath.value)
                }
            });
        });
        
        return baseResources;
    }
}