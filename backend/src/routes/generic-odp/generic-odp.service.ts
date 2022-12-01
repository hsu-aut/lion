import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SparqlService } from '../../shared-services/sparql.service';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { SparqlTemplateService } from './sparql-template.service';

@Injectable()
export class GenericOdpService {
	
	constructor(
		private sparqlService: SparqlService,
		private sparqlTemplateServic: SparqlTemplateService,
	){}

	// get routes
	public getAllClasses(): Observable<SparqlResponse> {
        return this.sparqlService.query(this.sparqlTemplateServic.selectAllClasses());
	}

}

