import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { RepositoryService } from '../../shared-services/repository.service';
import { ModelService } from '../../shared-services/model.service';

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
	@Delete('/:repositoryName/statements')
	deleteAllRdfTriples(@Param("repositoryName") repositoryName: string): any {
		return this.repoService.clearRepository(repositoryName);
	}

	/**
	 * Delete a repository with a given repository name
	 * @param repositoryName Name of the repository to delete
	 * @returns 
	 */
	@Delete('/:repositoryName')
	deleteRepository(@Param("repositoryName") repositoryName: string): any {
		return this.repoService.deleteRepository(repositoryName);
	}
}
