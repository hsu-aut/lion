import { SparqlResponse } from "@shared/interfaces/sparql/SparqlResponse";
import { map, OperatorFunction, pipe } from "rxjs";

/**
 * Extracts all values of one variable from a SparqlResponse. In case only one variable is present in the SparqlResponse, no variableName is
 * needed and the values of this one variable are returned.
 * @param source$ The source observable (a default / raw SparqlResponse)
 * @returns An array of values for the given variableName. In case there is just one variable, the list of values for this variable
 */
export function toSparqlVariableList(variableName?: string): OperatorFunction<SparqlResponse, Array<string>> {
    return pipe(map(v => {
        const vars = v.head.vars;
        const bindings = v.results.bindings;
        // grab all values of the given variableName
        if (variableName != null) {
            return bindings.map(bindingObj => bindingObj[variableName].value);
        }
        // if there is just one variabe, grab this variable's values
        if (vars.length == 1) {
            const onlyVariableName = vars[0];
            return bindings.map(bindingObj => bindingObj[onlyVariableName].value);
        }
        // else (no name given and more than one variables present), throw error
        throw "Trying to create a list of one variable but the query contains more than one. Please specify a variable.";
    }));
}



/**
 * Converts a source observable of type SparqlResponse to a table-like array where all non existing values of the raw response were filled with empty strings.
 * @param source$ The source observable (a default / raw) SparqlResponse
 * @returns An array of values in which each array contains an object that has the variables  of the SparqlResponse as keys
 */
export function toSparqlTable(): OperatorFunction<SparqlResponse, Array<Record<string, string>>> {
    return pipe(map(sparqlResponse => {
        const tableArray = new Array<Record<string, string>>();
        const vars = sparqlResponse.head.vars;
        const bindings = sparqlResponse.results.bindings;

        bindings.forEach(b => {
            const entry: Record<string, string> = {};
            let val;
            vars.forEach(v => {
                try {
                    val = b[v].value;
                } catch {
                    val = "";
                }
                entry[v] = val;
            });
            tableArray.push(entry);
        });
        // // v.results.bindings.map(binding => binding)
        return tableArray;

    }));
}
