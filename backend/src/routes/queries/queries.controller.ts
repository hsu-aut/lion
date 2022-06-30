import { Controller,Post} from '@nestjs/common';
import { StringBody } from '../../custom-decorator/StringBodyDecorator';
import { SparqlService } from '../../shared-services/sparql.service';
import { Observable } from 'rxjs';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';

/**
 * A controller that provides access to SPARQL operations
 */
@Controller('/lion_BE/queries')
export class QuerieController {
	
	constructor(private sparqlService:SparqlService) { }

	/**
	 * Handle a SPARQL SELECT query by passing it to the SPARQL service for execution against the connected triple store
	 * @param sparqlQuery The raw query string to be passed to the service as an HTTP request body
	 * @returns A SparqlResponse object as standardized by W3C
	 */
	@Post()
	selectQuery(@StringBody() sparqlQuery:string): Observable<SparqlResponse> {
		return this.sparqlService.query(sparqlQuery);
		
	}


	// TODO: Check error handling
	/**
	 * Handle a SPARQL UPDATE query by passing it to the SPARQL service for execution against the connected triple store
	 * @param sparqlQuery The raw query string to be passed to the service as an HTTP request body
	 * @returns A void observable
	 */
	@Post('/statements')
	insertQuery(@StringBody() sparqlQuery:string): Observable<void> {
		return this.sparqlService.update(sparqlQuery);
	}
}