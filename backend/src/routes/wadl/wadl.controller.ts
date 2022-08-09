import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SparqlResponse } from '../../models/sparql/SparqlResponse';
import { WadlService } from './wadl.service';
import { WadlBaseResource } from '@shared/models/odps/wadl/BaseResource';
import { WadlResource } from '@shared/models/odps/wadl/Resource';
import { WadlMethod } from '@shared/models/odps/wadl/WadlMethod';
import { WadlRequestService } from './wadl-request.service';
import { WadlRequest } from '../../models/odps/wadl/WadlRequest';

@Controller('lion_BE/wadl')
export class WadlController {
	
	constructor(
		private wadlService: WadlService,
		private wadlRequestService: WadlRequestService
	) { }

	@Get('base-resources') 
	getBaseResources(): Observable<SparqlResponse>{
		return this.wadlService.getBaseResources();
	}

	@Post('base-resources')
	addBaseResource(@Body() baseResource: WadlBaseResource): Observable<void>{
		return this.wadlService.addBaseResource(baseResource);
	}

	@Get('resources')
	getResources(@Query('baseResource') baseResource: string): Observable<SparqlResponse> {
		return this.wadlService.getResources(baseResource);
	}

	@Post('resources')
	addResource(@Body() resourceDefinition: WadlResource): Observable<void> {
		return this.wadlService.addResource(resourceDefinition);
	}

	@Delete('resources/:resourceIri')
	deleteResource(@Param('resourceIri') resourceIri: string): Observable<void> {
		return this.wadlService.deleteResource(resourceIri);
	}

	@Get('methods')
	getMethodTypes(): Observable<SparqlResponse> {
		return this.wadlService.getMethodTypes();
	}

	@Post('methods')
	addMethod(@Body() method: WadlMethod): Observable<void> {
		return this.wadlService.addMethod(method);
	}

	@Get('response-codes')
	getResponseCodes(): Observable<SparqlResponse> {
		return this.wadlService.getAllResponseCodes();
	}

	@Get('parameter-types')
	getParameterTypes(): Observable<SparqlResponse> {
		return this.wadlService.getParameterTypes();
	}

	@Get('requests')
	getRequest(@Query('resourceIri') resourceIri: string, @Query('methodTypeIri') methodTypeIri: string): Promise<WadlRequest> {
		console.log(resourceIri);
		console.log(methodTypeIri);
		
		
		return this.wadlRequestService.getRequest(resourceIri, methodTypeIri);
	}

	@Get('request-parameters')
	getRequestParametersOfType(
		@Query("resourceIri") resourceIri: string, 
		@Query("methodTypeIri") methodTypeIri: string,
		@Query("parameterTypeIri") parameterTypeIri: string): Observable<SparqlResponse> 
	{
		return this.wadlService.getRequestParameters(resourceIri, methodTypeIri, parameterTypeIri);
	}

	// ${this.wadlBasePath}${resourceIri}/${methodIri}/request-representation
	@Get('/:resourceIri/:methodTypeIri/request-representation')
	getRequestRepresentation(@Param('resourceIri') resourceIri: string, @Param('methodTypeIri') methodTypeIri: string){
		return this.wadlService.getRequestRepresentation(resourceIri, methodTypeIri);
	}

}
