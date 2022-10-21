import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SparqlResponse } from '../../models/sparql/SparqlResponse';
import { WadlService } from './wadl.service';
import { WadlBaseResource } from '@shared/models/odps/wadl/BaseResource';
import { WadlResource } from '@shared/models/odps/wadl/Resource';
import { WadlRequestService } from './wadl-request.service';
import { WadlCreateRequestDto, WadlRequest, WadlRequestDto } from '@shared/models/odps/wadl/WadlRequest';
import { WadlParameterDto } from '../../models/odps/wadl/WadlParameter';
import { WadlParameterService } from './wadl-parameter.service';


type ParamRequest = {parameter: WadlParameterDto} & {parentIri: string}

@Controller('lion_BE/wadl')
export class WadlController {
	
	constructor(
		private wadlService: WadlService,
		private wadlParameterService: WadlParameterService,
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

	@Post('requests')
	addMethod(@Body() createRequestDto: WadlCreateRequestDto): Promise<WadlRequestDto> {
		return this.wadlRequestService.addRequest(createRequestDto);
	}

	@Get('requests')
	getRequest(@Query('resourceIri') resourceIri: string, @Query('methodTypeIri') methodTypeIri: string): Promise<WadlRequestDto> {
		return this.wadlRequestService.getRequest(resourceIri, methodTypeIri);
	}

	@Post('parameters')
	addParameter(@Body() paramRequest: ParamRequest): Observable<void> {
		return this.wadlParameterService.addParameters(paramRequest.parentIri, [paramRequest.parameter]);
	}

	@Delete('parameters/:parameterIri')
	deleteParameter(@Param("parameterIri") parameterIri: string): Observable<void> {
		console.log("deleting " + parameterIri);
		
		return this.wadlParameterService.deleteParameter(parameterIri);
	}

	@Get('response-codes')
	getResponseCodes(): Observable<SparqlResponse> {
		return this.wadlService.getAllResponseCodes();
	}

	@Get('parameter-types')
	getParameterTypes(): Observable<SparqlResponse> {
		return this.wadlService.getParameterTypes();
	}

	@Get('parameters')
	getRequestParametersOfType(@Query("parentIri") parentIri: string): Observable<SparqlResponse> {
		return this.wadlService.getParameters(parentIri);
	}

	@Get('/:resourceIri/:methodTypeIri/request-representation')
	getRequestRepresentation(@Param('resourceIri') resourceIri: string, @Param('methodTypeIri') methodTypeIri: string){
		return this.wadlService.getRequestRepresentation(resourceIri, methodTypeIri);
	}

}
