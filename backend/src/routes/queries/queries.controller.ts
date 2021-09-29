import { Controller,Post} from '@nestjs/common';
import { StringBody } from '../../custom-decorator/StringBodyDecorator';
import { SparqlService } from '../../shared-services/sparql.service';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Controller('/lion_BE/queries')
export class QuerieController {
	constructor(private sparqlService:SparqlService) { }

	
	/**
	 *  POST SELECT
	 *  */
	// TODO: Überprüfen welches Return vom Frontend benötigt wird 
	@Post()
	selectQuery(@StringBody() sparqlQuery:string): Observable<AxiosResponse<any>> {
		return this.sparqlService.query(sparqlQuery);
		
	}
	// TODO: Noch nicht getestet
	// TODO: Überprüfen welches Return vom Frontend benötigt wird 
	/* POST INSERT */
	@Post('/statements')
	insertQuery(@StringBody() sparqlQuery:string): Observable<AxiosResponse<any>> {
		return this.sparqlService.update(sparqlQuery);
	}
}
class SparqlQuery {

}