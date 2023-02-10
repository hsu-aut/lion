import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RepositoryService } from '../../shared-services/repository.service';
import { RepositoryDto } from '@shared/models/repositories/RepositoryDto';
import { ModelService } from '../../shared-services/model.service';
import { map, Observable } from 'rxjs';

@Controller('/lion_BE/repositories')
export class RepositoriesController {
	constructor(private repoService: RepositoryService, private tboxService: ModelService) { }

	/**
	 * GET list of repositories
	 * @returns 
	 */
	@Get()
	getListOfRepositories(@Query('type') type: string): Observable<RepositoryDto[]> {
		if (type === "current") {
			return this.repoService.getWorkingRepository().pipe(map(repo => [repo]));
		}
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

	@Put('')
	setWorkingRepository(@Query("type") type: string, @Body() repoData: {repositoryId: string}): Observable<RepositoryDto> {
		if(type == "current") {
			return this.repoService.setWorkingRepository(repoData.repositoryId);
		}
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
	 * Clear a repository by deleting all statements. Does not delete the repository itself.
	 * @param repositoryName Name of the repository to clear
	 * @returns 
	 */
	@Delete('/:repositoryName/statements')
	deleteAllRdfTriples(@Param("repositoryName") repositoryName: string): any {
		return this.repoService.clearRepository(repositoryName);
	}

	/**
	 * Delete a complete repository with a given repository name
	 * @param repositoryName Name of the repository to delete
	 * @returns 
	 */
	@Delete('/:repositoryName')
	deleteRepository(@Param("repositoryName") repositoryName: string): any {
		return this.repoService.deleteRepository(repositoryName);
	}
}
