import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SparqlService } from '../../shared-services/sparql.service';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { GraphOperationService } from '../../shared-services/graph-operation.service';

@Injectable()
export class GenericOdpService {
	
	constructor(
		private sparqlService: SparqlService,
		private graphOperationService: GraphOperationService
	){}

	// get routes
	// TODO figure out if grap has to be specified with SELECT x FROM <http://lionFacts> WHERE y
    public getAllClasses(): Observable<SparqlResponse> {
        return this.sparqlService.query(`
			PREFIX owl: <http://www.w3.org/2002/07/owl#>
			SELECT ?class
			WHERE {
				?class a owl:Class .
			}
		`);
    }
    public getAllObjectPropertiesForDomainIndividual(individualIri: string): Observable<SparqlResponse> {
        return this.sparqlService.query(`
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT ?object_property
            WHERE {
                ${individualIri} a ?rdf_type_of_subject .
                ?object_property a owl:ObjectProperty .
                ?object_property rdfs:domain ?rdf_type_of_subject .
            }
        `);    
    }
    public getAllIndividualsOfClass(classIri: string): Observable<SparqlResponse> {
        return this.sparqlService.query(`
			SELECT ?individual
			WHERE {
				?individual a ${classIri}
			}
        `);
    }

}

