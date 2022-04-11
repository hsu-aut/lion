import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ISO224002ElementVariables, ISO224002KPIVariables } from '@shared/interfaces/iso224002-variables.interface';
import { Observable } from 'rxjs';
import { SparqlResponse } from '@shared/interfaces/sparql/SparqlResponse';
import { ISO224002Service } from './iso224002.service';

@Controller('lion_BE/iso224002')
export class ISO224002Controller {
	
	constructor(private iso224002Service: ISO224002Service) { }

	@Post('createElement')
	modifyType(@Query('action') action: string, @Query('activeGraph') activeGraph: string, 
		@Body() variables: ISO224002ElementVariables): Observable<void> | string {

		if (action == 'add') {
			return this.iso224002Service.buildElement(variables, activeGraph);
		} else if (action == 'build') {
			return this.iso224002Service.getElementBuildString(variables, activeGraph);
		} else {
			return null;
		}

	}

	@Post('createKPI')
	modifyInstance(@Query('action') action: string, @Query('activeGraph') activeGraph: string, 
		@Body() variables: ISO224002KPIVariables): Observable<void> | string {

		if (action == 'add') {
			return this.iso224002Service.buildKPI(variables, activeGraph);
		} else if (action == 'build') {
			return this.iso224002Service.getKPIBuildString(variables, activeGraph);
		} else {
			return null;
		}

	}

	@Get('allEntityInfo')
	getTableOfAllEntityInfo(): Observable<SparqlResponse> {
		return this.iso224002Service.getTableOfAllEntityInfo();
	}

	@Get('kpiGroups')
	getListOfKPIGroups(): Observable<SparqlResponse> {
		return this.iso224002Service.getListOfKPIGroups();
	}  

	@Get('listKPIs')
	getListOfKPIs(): Observable<SparqlResponse> {
		return this.iso224002Service.getListOfKPIs();
	}

	@Get('orgElements')
	getListOfOrganizationalElements(): Observable<SparqlResponse> {
		return this.iso224002Service.getListOfOrganizationalElements();
	}

	@Get('nonOrgElements')
	getListOfNonOrganizationalElements(): Observable<SparqlResponse> {
		return this.iso224002Service.getListOfNonOrganizationalElements();
	}

	@Get('elementGroups')
	getListOfElementGroups(): Observable<SparqlResponse> {
		return this.iso224002Service.getListOfElementGroups();
	}

	@Get('orgElementClasses')
	getListOfOrganizationalElementClasses(): Observable<SparqlResponse> {
		return this.iso224002Service.getListOfOrganizationalElementClasses();
	}

	@Get('elements')
	getTableOfElements(): Observable<SparqlResponse> {
		return this.iso224002Service.getTableOfElements();
	}

	@Get('tableKPIs')
	getTableOfKPIs(): Observable<SparqlResponse> {
		return this.iso224002Service.getTableOfKPIs();
	}

	@Get('listElementsByGroup')
	getListOfElementsByGroup(@Query('groupNameIRI') groupNameIRI: string): Observable<SparqlResponse> {
		return this.iso224002Service.getListOfElementsByGroup(groupNameIRI);
	}

	@Get('listClassConstraints')
	getListOfClassConstraintEnum(
		@Query('kpiClass') kpiClass: string, @Query('constrDataProp') constrainingDataProperty: string): Observable<SparqlResponse> {
		return this.iso224002Service.getListOfClassConstraintEnum(kpiClass, constrainingDataProperty);
	}

}
