import { Injectable } from '@nestjs/common';

@Injectable()
export class SparqlTemplateService {

    public selectAllClasses(): string { 
        return `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            SELECT ?class
            WHERE {
                ?class a owl:Class .
            }
        `;
    }

    // public selectAllClasses(): string { 
    //     return `
    //         PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    //         PREFIX owl: <http://www.w3.org/2002/07/owl#>

    //         SELECT ?class
    //         WHERE {
    //             ?class a owl:Class .
    //         }
    //     `;
    // }

}