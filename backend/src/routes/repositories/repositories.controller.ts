import { Controller, Delete, Get, Post, Query} from '@nestjs/common';
import { query } from 'express';
import { RepositoryService } from '../../shared-services/repository.service';
import { TBoxService } from '../../shared-services/t-box.service';

@Controller('/lion_BE/repositories') 
export class RepositoriesController {
	constructor(private repService:RepositoryService, private tboxService:TBoxService) {}

	/**
 * GET list of repositories
 */
	@Get()
	getListOfRepositories(): any {
		return this.repService.getAllRepositories();
	} 

	/**
 *CREATE new repository TOBEDISCUSSED
*/ 
	@Get('/create')
	createNewRepository(@Query('repositoryName') repositoryName:string): any {
		return this.repService.createRepository(repositoryName); // repService.createRepository muss noch angepasst werden 
	}
	/** 
 * GET all RDF triples
 */

	@Get()
	getAllRdfTriples() : any {
		return this.tboxService.getAllTriples(); 
	}

	/** 
 * DELETE all RDF triples
 */
	@Delete('/clear')
	deleteAllRdfTriples(@Query('repositoryName') repositoryName:string): any {
		return this.repService.clearRepository(repositoryName);
	}

	/** 
 * INSERT TBOX to repository  TOBEDISCUSSED
 */

@Get('/buildTBox')
	insertTboxToRepository(@Query('patternName') patternName: string): any {
		return this.tboxService.insertTBox(patternName); //TOBEDISCUSSED

	}
}