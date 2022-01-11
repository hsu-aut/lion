import { Controller, Get, Query } from '@nestjs/common';
import { EclassProperty } from './eclass-property.interface';  //todo change to @shared folder
import { EclassSearchService } from './eclass-search.service';

@Controller('lion_BE/eclassSearch')
export class EclassSearchController {
	constructor(private eclassSearchService: EclassSearchService) { }

	@Get('configDB')
	connectDb(): void {
		this.eclassSearchService.configDB();
	}

	@Get('configWS')
	createRequestConfig(): void {
		this.eclassSearchService.configWS();
	}

	@Get('list')
	getPropertiesList(@Query('prop') prop: string, @Query('via') via: string): Promise<EclassProperty[]> {
		if (via == 'db' || via == null) {
			// do if access via mysql db is requested 
			// default, also chosse this option if no parameter 'via' was defined  
			try {
				return this.eclassSearchService.getPropertiesByNameFromDB(prop);
			} catch (error) {
				console.error(error + 'cannot get property from database');
			}
		} else if (via == 'ws') {
			// do if access via webservice is requested
			try {
				return this.eclassSearchService.getPropertiesByNameFromWebService(prop);
			} catch (error) {
				console.error(error + 'cannot get property from webservice');
			}
		} else {
			// do if access not properly defined
			console.error('parameter not defined:' + via);
		}
	}
}
