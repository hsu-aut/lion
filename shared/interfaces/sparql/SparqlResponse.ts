export interface SparqlResponse {
    head: {
        vars: Array<string>
    },
    results: {
        bindings:[
            Record<string, {type: string, value:string}>
        ]
    }
}