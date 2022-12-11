import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { GenericOdpService } from './generic-odp.service';

@Controller('lion_BE/generic-odp')
export class GenericOdpController {
	
	constructor(private genericOdpService: GenericOdpService) { }

	// get routes
	@Get('all-classes')
	getAllClasses(): Observable<SparqlResponse> {
		return this.genericOdpService.getAllClasses();
	}
	@Get('all-ind')
	getAllIndividuals(): Observable<SparqlResponse> {
		return this.genericOdpService.getAllIndividuals();
	}
	@Get('ind-of-class')
	getAllIndividualsOfClass(@Query('classIri') classIri: string): Observable<SparqlResponse> {
		return this.genericOdpService.getAllIndividualsOfClass(classIri);
	}
	@Get('op-for-dom-ind')
	getAllObjectPropertiesForDomainIndividual(@Query('individualIri') individualIri: string): Observable<SparqlResponse> {
		return this.genericOdpService.getAllObjectPropertiesForDomainIndividual(individualIri);
	}
	@Get('rng-ind-for-op')
	getAllRangeIndividualsForObjectProperty(@Query('objectPropertyIri') objectPropertyIri: string): Observable<SparqlResponse> {
		return this.genericOdpService.getAllRangeIndividualsForObjectProperty(objectPropertyIri);
	}

	// post route to create triple
	//

}
