import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { GenericOdpService } from './generic-odp.service';

@Controller('lion_BE/generic-odp')
export class GenericOdpController {
	
	constructor(private genericOdpService: GenericOdpService) { }

	@Get('all-classes')
	getTableOfAllEntityInfo(): Observable<SparqlResponse> {
		return this.genericOdpService.getAllClasses();
	}

}
