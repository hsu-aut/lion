import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueriesService } from '../../shared/services/backEnd/queries.service';

/**
 * A service allowing basic interaction on the basis of triples (such as adding or deleting triples)
 */
@Injectable({
    providedIn: 'root'
})
export class TripleService {

    constructor(
        private queryService: QueriesService
    ) { }

    /**
     * Adds a given triple to the triple store
     * @param triple Triple to add
     * @param graph Graph to add the triple into
     */
    addTriple(triple: Triple, graph: string): Observable<void> {
        const insertString = this.buildTripleInsertString(triple, graph);
        return this.queryService.executeUpdate(insertString);
    }

    /**
     * Builds a SPARQL INSERT string to add triples to a triple store
     * @param triple Triple to create the insert string for
     * @param graph Graph to insert triples into
     * @returns A SPARQL INSERT string that adds the given triples into the given graph
     */
    buildTripleInsertString(triple: Triple, graph: string): string {
        const insertString = `
            INSERT {
                GRAPH <${graph}>{
                    ?subject ?predicate ?object;
                    a owl:NamedIndividual.}
            } WHERE {
                BIND(IRI(STR("${triple.subject}")) AS ?subject).
                BIND(IRI(STR("${triple.predicate}")) AS ?predicate).
                BIND(IRI(STR("${triple.object}")) AS ?object).
            }`;
        return insertString;
    }

}


export class Triple {

    constructor(
        public subject: string,
        public predicate: string,
        public object: string
    ){}
}

