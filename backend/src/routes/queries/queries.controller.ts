import { Body, Controller, Get, Post, Query } from '@nestjs/common';

//import { StringBody } from 'src/custom-decorator/StringBodyDecorator';
import { QuerieService } from './queries.service';


@Controller('/lion_BE/queries')
export class QuerieController {
	constructor(private readonly querieService: QuerieService) { }


	/**
	 *  POST SELECT
	 *  */
	@Post()
	//selectQuery(@StringBody() sparqlQuery:string):void{
	selectQuery(@Query('repositoryName') repositoryName: string, @Body() sparqlQuery:string): void {
		this.querieService.selectQuery(repositoryName);
		console.log(sparqlQuery);
	}

	/* POST INSERT */
	@Post('/statements')
	insertQuery(@Query('repositoryName') repositoryName: string): void {
		this.querieService.insertQuery(repositoryName);
	}
}
class SparqlQuery {

}