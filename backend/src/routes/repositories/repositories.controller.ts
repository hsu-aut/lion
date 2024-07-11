import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RepositoryService } from '../../shared-services/repository.service';
import { RepositoryDto } from '@shared/models/repositories/RepositoryDto';
import { NewRepositoryRequestDto } from '@shared/models/repositories/NewRepositoryRequestDto';
import { ChangeRepositoryRequestDto } from '@shared/models/repositories/ChangeRepositoryRequestDto'; 
import { ModelService } from '../../shared-services/model.service';
import { map, Observable } from 'rxjs';
import { GraphDbRepositoryDocument } from '../../users/user-data/graphdb-repository.schema';

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
	@Post('')
	addNewRepository(@Body()newRepositoryRequest: NewRepositoryRequestDto): any {
		return this.repoService.createRepositoryForCurrentUser(newRepositoryRequest.repositoryName);
	}

	@Put('')
	setWorkingRepository(@Query("type") type: string, @Body() changeRepositoryRequest: ChangeRepositoryRequestDto):
		Observable<RepositoryDto> {
		if(type == "current") {
			return this.repoService.setWorkingRepositoryById(changeRepositoryRequest.id);
		}
	}

	/**
	 * GET all RDF triples of one repository
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
	deleteAllRdfTriples(@Param("repositoryName") repositoryName: string): Observable<void> {
		return this.repoService.clearRepositoryById(repositoryName);
	}

	/**
	 * Delete a complete repository with a given repository name
	 * @param repositoryName Name of the repository to delete
	 * @returns 
	 */
	@Delete('/:repositoryName')
	deleteRepository(@Param("repositoryName") repositoryName: string): Observable<void> {
		return this.repoService.deleteRepositoryById(repositoryName);
	}
}
