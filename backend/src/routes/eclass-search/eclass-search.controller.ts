import { Controller, Get, Query } from '@nestjs/common';
import { EclassSearchService } from './eclass-search.service';

@Controller('lion_BE/eclassSearch')
export class EclassSearchController {
	constructor(private eclassSearchService: EclassSearchService) {}

  @Get('connect')
	connectDb(): void {
		this.eclassSearchService.connectDb();
	}

  @Get('disconnect')
  disconnectDb(): void {
  	this.eclassSearchService.disconnectDb();
  }

  @Get('list')
  getPropertiesList(@Query('prop') prop, @Query('via') via): Promise<any> {
  	if (via == 'db' || via == null) {
  		// do if access via mysql db is requested 
		// default, also chosse this option if no parameter 'via' was defined  
		try {
  			return this.eclassSearchService.getPropertiesByNamefromDb(prop);
  		} catch (error) {
  			console.error(error + 'cannot get property from database');
  		}
  	} else if (via == 'ws') {
  		// do if access via webservice is requested
  		try {
  			console.log("eclass webservice not yet implemented :'(");
  		} catch (error) {
  			console.error(error + 'cannot get property from webservice');
  		}
  	} else {
  		// do if access not properly defined
  		console.error('parameter not defined:' + via);
  	}
  }
}
