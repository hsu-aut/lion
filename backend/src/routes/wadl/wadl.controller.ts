import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SparqlResponse } from '../../models/sparql/SparqlResponse';
import { WadlService } from './wadl.service';
import { WadlBaseResource } from '@shared/models/odps/wadl/BaseResource';
import { WadlResource } from '@shared/models/odps/wadl/Resource';
import { WadlRequestService } from './wadl-request.service';
import { WadlCreateRequestDto, WadlRequestDto } from '@shared/models/odps/wadl/WadlRequest';
import { WadlParameter, WadlParameterDto } from '@shared/models/odps/wadl/WadlParameter';
import { WadlParameterService } from './wadl-parameter.service';
import { WadlRepresentation, WadlRepresentationDto } from '@shared/models/odps/wadl/WadlRepresentation';
import { WadlRepresentationService } from './wadl-representation.service';
import { WadlResponseService } from './wadl-response.service';
import { WadlCreateResponseDto, WadlResponseDto } from '@shared/models/odps/wadl/WadlResponse';


@Controller('lion_BE/wadl')
export class WadlController {
	
	constructor(
		private wadlService: WadlService,
		private wadlParameterService: WadlParameterService,
		private wadlRequestService: WadlRequestService,
		private wadlResponseService: WadlResponseService,
		private wadlRepresentationService: WadlRepresentationService
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
	addRequest(@Body() createRequestDto: WadlCreateRequestDto): Promise<WadlRequestDto> {
		return this.wadlRequestService.addRequest(createRequestDto);
	}

	@Get('requests')
	getRequest(@Query('resourceIri') resourceIri: string, @Query('methodTypeIri') methodTypeIri: string): Promise<WadlRequestDto> {
		return this.wadlRequestService.getRequest(resourceIri, methodTypeIri);
	}

	@Post('responses')
	addResponse(@Body() createResponseDto: WadlCreateResponseDto): Promise<WadlResponseDto> {
		return this.wadlResponseService.addResponse(createResponseDto);
	}

	@Get('responses')
	getResponses(@Query('resourceIri') resourceIri: string, @Query('methodTypeIri') methodTypeIri: string): Promise<WadlRequestDto> {
		return this.wadlRequestService.getRequest(resourceIri, methodTypeIri);
	}

	@Post('parameters')
	addParameter(@Body() parameterDto: WadlParameterDto): Observable<void> {
		const parameter = WadlParameter.fromDto(parameterDto);
		return this.wadlParameterService.addParameters([parameter]);
	}

	@Delete('parameters/:parameterIri')
	deleteParameter(@Param("parameterIri") parameterIri: string): Observable<void> {
		return this.wadlParameterService.deleteParameter(parameterIri);
	}

	@Get('response-codes')
	getResponseCodes(): Observable<SparqlResponse> {
		return this.wadlService.getAllResponseCodes();
	}

	@Get('parameter-types')
	getParameterTypes(): Observable<SparqlResponse> {
		return this.wadlParameterService.getParameterTypes();
	}

	@Get('parameters')
	getParametersOfParent(@Query("parentIri") parentIri: string): Observable<WadlParameterDto[]> {
		return this.wadlParameterService.getParameters(parentIri);
	}

	@Get('/:resourceIri/:methodTypeIri/request-representation')
	getRequestRepresentation(@Param('resourceIri') resourceIri: string, @Param('methodTypeIri') methodTypeIri: string){
		return this.wadlService.getRequestRepresentation(resourceIri, methodTypeIri);
	}

	@Get('representations')
	getRepresentations(@Query("parentIri") parentIri: string): Promise<WadlRepresentationDto[]> {
		console.log("controller rep");
		
		return this.wadlRepresentationService.getRepresentations(parentIri);
	}

	@Post('representations')
	addRepresentation(@Body() rep: WadlRepresentationDto): Observable<WadlRepresentationDto> {
		const representation = WadlRepresentation.fromDto(rep);
		return this.wadlRepresentationService.addRepresentation(representation);
	}

}
