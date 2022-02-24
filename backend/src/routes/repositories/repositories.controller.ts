import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { RepositoryService } from '../../shared-services/repository.service';
import { TBoxPatternName, ModelService } from '../../shared-services/model.service';

@Controller('/lion_BE/repositories')
export class RepositoriesController {
	constructor(private repService: RepositoryService, private tboxService: ModelService) { }

	/**
	 * GET list of repositories
	 * @returns 
	 */
	@Get()
	getListOfRepositories(): any {
		return this.repService.getAllRepositories();
	}

	/**
	 * Create a new repository with a given name
	 * @param repositoryName Name of the repository to create
	 * @returns 
	 */
	@Get('/create')
	createNewRepository(@Query('repositoryName') repositoryName: string): any {
		return this.repService.createRepository(repositoryName);
	}

	/**
	 * GET all RDF triples
	 * @returns 
	 */
	@Get('/current/triples')
	getAllRdfTriples(): any {
		return this.tboxService.getAllTriples();
	}

	/** 
	* DELETE all RDF triples
	*/
	@Delete('/current/statements')
	deleteAllRdfTriples(): any {
		return this.repService.clearRepository();
	}

	/** 
	* DELETE repository
	*/
	@Delete('/current')
	deleteRepository(): any {
		return this.repService.deleteRepository();
	}

	/** 
	* INSERT TBOX to repository
	*/
	@Get('/buildTBox')
	insertTboxToRepository(@Query('patternName') patternName: TBoxPatternName): any {
		return this.tboxService.insertTBox(patternName);
	}
}
