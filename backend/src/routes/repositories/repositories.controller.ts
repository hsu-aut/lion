import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { RepositoryService } from '../../shared-services/repository.service';
import { ModelService } from '../../shared-services/model.service';
import { OdpName } from '@shared/enums/OdpName';

@Controller('/lion_BE/repositories')
export class RepositoriesController {
	constructor(private repoService: RepositoryService, private tboxService: ModelService) { }

	/**
	 * GET list of repositories
	 * @returns 
	 */
	@Get()
	getListOfRepositories(): any {
		return this.repoService.getAllRepositories();
	}

	/**
	 * Create a new repository with a given name
	 * @param repositoryName Name of the repository to create
	 * @returns 
	 */
	@Get('/create')
	createNewRepository(@Query('repositoryName') repositoryName: string): any {
		return this.repoService.createRepository(repositoryName);
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
		return this.repoService.clearRepository();
	}

	/** 
	* DELETE repository
	*/
	@Delete('/current')
	deleteRepository(): any {
		return this.repoService.deleteRepository();
	}
}
