import { Controller,Post} from '@nestjs/common';
import { StringBody } from '../../custom-decorator/StringBodyDecorator';
import { SparqlService } from '../../shared-services/sparql.service';
import { Observable } from 'rxjs';
import { SparqlResponse } from '@shared/interfaces/sparql/SparqlResponse';

@Controller('/lion_BE/queries')
export class QuerieController {
	constructor(private sparqlService:SparqlService) { }

	
	/**
	 *  POST SELECT
	 *  */
	// TODO: Überprüfen welches Return vom Frontend benötigt wird 
	@Post()
	selectQuery(@StringBody() sparqlQuery:string): Observable<SparqlResponse> {
		return this.sparqlService.query(sparqlQuery);
		
	}


	// TODO: Noch nicht getestet
	// TODO: Überprüfen welches Return vom Frontend benötigt wird 
	/* POST INSERT */
	@Post('/statements')
	insertQuery(@StringBody() sparqlQuery:string): Observable<void> {
		console.log("getting update");
		console.log(sparqlQuery);
		
		
		return this.sparqlService.update(sparqlQuery);
	}
}
class SparqlQuery {

}