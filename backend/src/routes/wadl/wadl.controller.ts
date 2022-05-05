import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SparqlResponse } from '../../models/sparql/SparqlResponse';
import { WadlService } from './wadl.service';
import { BaseResourceDefinition } from '@shared/models/odps/wadl/BaseResourceDefinition';

@Controller('lion_BE/wadl')
export class WadlController {
	
	constructor(private wadlService: WadlService) { }

	@Get('base-resources') 
	getBaseResources(): Observable<SparqlResponse>{
		return this.wadlService.getBaseResources();
	}

	@Post('base-resources')
	addBaseResource(@Body() baseResource: BaseResourceDefinition): Observable<void>{
		return this.wadlService.addBaseResource(baseResource);
	}

	@Get('services')
	getServices(@Query('baseResource') baseResource: string): Observable<SparqlResponse> {
		return this.wadlService.getServices(baseResource);
	}

	@Get('methods')
	getMethods(): Observable<SparqlResponse> {
		return this.wadlService.getMethods();
	}

	@Get('response-codes')
	getResponseCodes(): Observable<SparqlResponse> {
		return this.wadlService.getAllResponseCodes();
	}

	@Get('parameter-types')
	getParameterTypes(): Observable<SparqlResponse> {
		return this.wadlService.getParameterTypes();
	}

	@Get('request-parameters')
	getRequestParameters(): Observable<SparqlResponse> {
		return this.getRequestParameters();
	}

}
