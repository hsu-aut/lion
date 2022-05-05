import { Controller, Get, Post, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SparqlResponse } from '@shared/interfaces/sparql/SparqlResponse';
import { ISA88Service } from './isa88.service';

@Controller('lion_BE/isa88')
export class ISA88Controller {
	
	constructor(private isa88Service: ISA88Service) { }

	@Get('behaviorInfoTable')
	getTableOfKPIs(): Observable<SparqlResponse> {
		return this.isa88Service.getBehaviorInfoTable();	
	}

	@Get('buildISA88')
	buildISA88(
		@Query('activeNameSpace') activeNameSpace: string,
		@Query('activeGraph') activeGraph: string,
		@Query('SystemName') SystemName: string,
		@Query('mode') mode: string,
		@Query('SystemIRI') SystemIRI: string,
		@Query('action') action: string): any {
		if (action == 'add') {
			return this.isa88Service.executeISA88Build(activeNameSpace, activeGraph, SystemName, mode, SystemIRI);
		} else if (action == 'build') {
			return this.isa88Service.getISA88BuildString(activeNameSpace, activeGraph, SystemName, mode, SystemIRI);
		} else {
			return null;
		}
			
	}

}
