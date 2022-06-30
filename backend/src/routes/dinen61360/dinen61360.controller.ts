import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DINEN61360Variables } from '@shared/models/dinen61360-variables.interface';
import { Observable } from 'rxjs';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { DINEN61360Service } from './dinen61360.service';

@Controller('lion_BE/dinen61360')
export class DINEN61360Controller {
	
	constructor(private dinen61360Service: DINEN61360Service) { }

	@Post('modifyType')
	modifyType(@Query('action') action: string, @Query('activeGraph') activeGraph: string, 
		@Body() variables: DINEN61360Variables): Observable<void> | string {
		if (action == 'add') {
			return this.dinen61360Service.buildDINEN61360T(variables, activeGraph);
		} else if (action == 'build') {
			return this.dinen61360Service.getTypeBuildString(variables, activeGraph);
		} else {
			return null;
		}
	}

	@Post('modifyInstance')
	modifyInstance(@Query('action') action: string, @Query('activeGraph') activeGraph: string, 
		@Body() variables: DINEN61360Variables): Observable<void> | string {
		if (action == 'add') {
			return this.dinen61360Service.buildDINEN61360I(variables, activeGraph);
		} else if (action == 'build') {
			return this.dinen61360Service.getInstanceBuildString(variables, activeGraph);
		} else {
			return null;
		}
	}

	@Get('getAllTypes')
	getAllTypes(): Observable<SparqlResponse> { 
		return this.dinen61360Service.getAllTypes();
	}

	@Get('getAllDE')
	getAllDE(): Observable<SparqlResponse> {
		return this.dinen61360Service.getAllDE();
	}

	@Get('getAllDET')
	getAllDET(): Observable<SparqlResponse> {
		return this.dinen61360Service.getAllDET();
	}

	@Get('getAllDEI')
	getAllDEI(): Observable<SparqlResponse> { 
		return this.dinen61360Service.getAllDEI();
	}

	@Get('getDataTypes')
	getDataTypes(): Observable<SparqlResponse> { 
		return this.dinen61360Service.getDataTypes();
	}

	@Get('getAllInstanceInfo')
	getAllInstanceInfo(): Observable<SparqlResponse> {
		return this.dinen61360Service.getAllInstanceInfo();
	}

	@Get('getExpressionGoals')
	getExpressionGoals(): Observable<SparqlResponse> {
		return this.dinen61360Service.getExpressionGoals();
	}

	@Get('getLogicInterpretations')
	getLogicInterpretations(): Observable<SparqlResponse> {
		return this.dinen61360Service.getLogicInterpretations();
	}

}
