import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueriesService } from '@shared-services/backEnd/queries.service';
import { PrefixesService } from '../../../shared/services/prefixes.service';

/**
 * A service allowing basic interaction on the basis of triples (such as adding or deleting triples)
 */
@Injectable({
    providedIn: 'root'
})
export class TripleService {

    constructor(
        private queryService: QueriesService,
        private prefixService: PrefixesService
    ) { }

    /**
     * Adds a given triple to the triple store
     * @param triple Triple to add
     * @param graph Graph to add the triple into
     */
    addTriple(triple: Triple): Observable<void> {
        Object.keys(triple).forEach(key => triple[key] = this.prefixService.addOrParseNamespace(triple[key]));
        const insertString = this.buildTripleInsertString(triple);
        return this.queryService.executeUpdate(insertString);
    }

    deleteTriple(triple: Triple): Observable<void> {
        Object.keys(triple).forEach(key => triple[key] = this.prefixService.addOrParseNamespace(triple[key]));
        const deleteString = this.buildTripleDeleteString(triple);
        return this.queryService.executeUpdate(deleteString);
    }

    /**
     * Builds a SPARQL INSERT string to add triples to a triple store
     * @param triple Triple to create the insert string for
     * @param graph Graph to insert triples into
     * @returns A SPARQL INSERT string that adds the given triples into the given graph
     */
    buildTripleInsertString(triple: Triple): string {
        const insertString = `
            INSERT {
                ?subject ?predicate ?object;
                a owl:NamedIndividual.
            } WHERE {
                BIND(IRI(STR("${triple.subject}")) AS ?subject).
                BIND(IRI(STR("${triple.predicate}")) AS ?predicate).
                BIND(IRI(STR("${triple.object}")) AS ?object).
            }`;
        return insertString;
    }

    /**
     * Builds a SPARQL DELETE string to delete a triple from a triple store
     * @param triple Triple to create the DELETE string for
     * @returns A SPARQL DELETE string that deletes the given triples from the current graph
     */
    buildTripleDeleteString(triple: Triple): string {
        const deleteString = `
            DELETE {
                ?subject ?predicate ?object;
                a owl:NamedIndividual.
            } WHERE {
                BIND(IRI(STR("${triple.subject}")) AS ?subject).
                BIND(IRI(STR("${triple.predicate}")) AS ?predicate).
                BIND(IRI(STR("${triple.object}")) AS ?object).
            }`;
        return deleteString;
    }

}


export class Triple {

    constructor(
        public subject: string,
        public predicate: string,
        public object: string
    ){}
}

