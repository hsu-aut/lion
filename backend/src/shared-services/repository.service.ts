import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RepositoryDto } from '@shared/models/repositories/RepositoryDto';
import { from, Observable, forkJoin  } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as fs from 'fs';
import * as FormData from 'form-data';
import { GraphDbRequestException } from '../custom-exceptions/GraphDbRequestException';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GraphDbRepository, GraphDbRepositoryDocument } from '../users/user-data/graphdb-repository.schema';
import { User, UserDocument } from '../users/user.schema';
import { CurrentUserService } from './current-user.service';
import { MongoDbRequestException } from '../custom-exceptions/MongoDbRequestException';

/**
 * A service that provides functionality to interact with GraphDB repositories
 */
@Injectable()
export class RepositoryService {

	constructor(
		private http: HttpService,
		@InjectModel(User.name) private userModel: Model<User>,
		@InjectModel(GraphDbRepository.name) private graphDbRepositoryModel: Model<GraphDbRepository>,
		private currentUserService: CurrentUserService,
	) {}

	/**
	 * get all repsitories owned by the current user
	 * @returns Observable of an array of all repsitories
	 */
	getAllRepositories(): Observable<Array<RepositoryDto>> { 
		return this.getAllRepositoryDocs().pipe(
			map((allRepos: Array<GraphDbRepositoryDocument>) => allRepos.map(
				(repo: GraphDbRepositoryDocument) => this.convertRepositoryDocToDto(repo)
			))
		);
	}

	/**
	 * Get the currently activated working repository
	 * @returns Observable of the current working repository
	 */
	getWorkingRepository(): Observable<RepositoryDto> {
		return this.getWorkingRepositoryDoc().pipe(map((repo: GraphDbRepositoryDocument) => {
			// if undefined, no working repo is set so return undefined
			if (repo === undefined) return undefined;
			// else
			return this.convertRepositoryDocToDto(repo);
		}));	
	}

	/**
	 * set the current users working directory
	 * @param repoId the id of the new working repo to be set
	 * @returns the new working repo
	 */
	setWorkingRepositoryById(repoId: string): Observable<RepositoryDto> { 
		return this.getRepositoryById(repoId).pipe(
			mergeMap((repository: GraphDbRepositoryDocument) => this.setWorkingRepository(repository)),
			mergeMap(( ) => this.getWorkingRepository())
		);
	}

	/**
	 * Creates a new repository with a given name
	 * @param repositoryName Name of the repository that will be created
	 */
	createRepository(newRepositoryName: string): Observable<void> {

		// get current user 
		const currentUser: Observable<UserDocument> = this.currentUserService.getCurrentUser();

		// create new repo as mongodb document and save doc
		const newRepositoryPromise: Promise<GraphDbRepositoryDocument> = new this.graphDbRepositoryModel({ 
			name: newRepositoryName, 
			uri: "not initiated",
			workingDirectory: false 
		}).save();

		// convert from promise to observable and catch errors during creation
		const newRepository: Observable<GraphDbRepositoryDocument> = from(newRepositoryPromise).pipe(
			catchError(error => { throw new MongoDbRequestException("error creating repo doc: " + error.message); }));

		// create config for graphdb request and execute reuqest
		const graphDbRequest: Observable<void> = newRepository.pipe(
			// create config
			map((repository: GraphDbRepositoryDocument) => (
				this.createRepoConfig(repository._id.toString(), repository.name)
			)),
			// execute request merge resulting  inner observable
			mergeMap((requestConfig: AxiosRequestConfig) => (
				this.http.request<void>(requestConfig)
			)),
			// map to void (not axios response)
			map(( ) => { return; }),
			// in case of errors 
			catchError((error) => { 
				// delete mongo db repo doc
				newRepository.subscribe((newRepository: GraphDbRepositoryDocument) =>{
					newRepository.deleteOne();
				});
				// rethrow as graphdb error
				throw new GraphDbRequestException("error creating repo: " + error.message); 
			}),
		);

		// join observables and return 
		return forkJoin([currentUser, newRepository, graphDbRequest]).pipe(
			mergeMap(([currentUser, newRepository, graphDbRequest]: [UserDocument, GraphDbRepositoryDocument, void]) => {
				// add repo to user 
				currentUser.graphDbRepositories.push(newRepository);
				// currentUser.save();
				// add mongodb document id as uri
				newRepository.uri = "http://localhost:7200/repositories/" + newRepository._id.toString();
				// newRepository.save();
				return forkJoin([from(currentUser.save()), from(newRepository.save())]);
			}),
			mergeMap(([currentUser, newRepository]: [UserDocument, GraphDbRepositoryDocument]) => {
				return this.setWorkingRepository(newRepository);
			})
		);

	}

	/**
     * Clears a repository with a given ID by deleting all triples
     * @param repositoryId ID of the repository to clear 
     * @returns void if successfull
     */
	clearRepositoryById(repositoryId: string): Observable<void> {
		return this.getRepositoryById(repositoryId).pipe(mergeMap(
			(repository: GraphDbRepositoryDocument) => this.clearRepository(repository)
		));
	}

	/**
	 * Deletes an existing repository with a given ID
	 * @param repositoryId ID of the repository to delete
	 * @returns void if successfull
	 */
	deleteRepositoryById(repositoryId: string): Observable<void> {
		return this.getRepositoryById(repositoryId).pipe(mergeMap(
			(repository: GraphDbRepositoryDocument) => this.deleteRepository(repository)
		));
	}

	/**
	 * get a repository by its id
	 * @param repositoryId the id of the repository
	 * @returns the repo as a mongo db document 
	 */
	private getRepositoryById(repositoryId: string): Observable<GraphDbRepositoryDocument> {
		const repoDocPromise: Promise<GraphDbRepositoryDocument> = this.graphDbRepositoryModel.findById(repositoryId).exec();
		return from(repoDocPromise).pipe(
			catchError(error => { 
				throw new MongoDbRequestException("error retrieving repository: " + error.message);
			})
		); 
	}

	/**
	 * set the current users working directory
	 * @param repo the repository as a mongo db document
	 * @returns void if successfull
	 */
	private setWorkingRepository(repo: GraphDbRepositoryDocument): Observable<void> { 
		return this.currentUserService.getCurrentUser().pipe(
			// check if user owns repo (throws exception otherwise)
			map((user: UserDocument) =>	this.userOwnsRepository(repo, user)),
			// get old working directory
			mergeMap(() => this.getWorkingRepositoryDoc()),
			// unset old working directory and save
			map((oldWorkingRepo: GraphDbRepositoryDocument) => {
				// if undefined, no working repo is set so just skip this 
				if (oldWorkingRepo === undefined) return;
				// else, unset old working directory and save
				oldWorkingRepo.workingDirectory = false;
				return from(oldWorkingRepo.save());
			}),
			// on completion, set new working repo and save
			map(( ) => {
				repo.workingDirectory = true;
				return from(repo.save());
			}),
			// map to void on completion
			map(( ) => { return; }),
			// catch errors
			catchError(error => {
				throw new MongoDbRequestException("could not update working repo: " + error.message);
			})
		);
	}

	/**
	 * get all repsitories owned by the current user
	 * @returns Observable of an array of all repsitories as mongo db documents
	 */
	private getAllRepositoryDocs(): Observable<Array<GraphDbRepositoryDocument>> {
		return this.currentUserService.getCurrentUser().pipe(
			// populate repositories in user document to get inner data
			mergeMap((user: UserDocument) => from(user.populate('graphDbRepositories'))),
			map((user: UserDocument) => {
				// if array exists and is not empty, return it
				if (user.graphDbRepositories.length > 0) {
					return (user.graphDbRepositories as Array<GraphDbRepositoryDocument>);
				}
				// else throw error
				throw new MongoDbRequestException("user owns no repos");
			})
		);
	}

	/**
	 * Get the currently activated working repository
	 * @returns Observable of the current working repository as a mongo db document or undefined if no working repo is set
	 */
	private getWorkingRepositoryDoc(): Observable<GraphDbRepositoryDocument> {
		return this.getAllRepositoryDocs().pipe(
			// find repo set to true
			map((allRepos: Array<GraphDbRepositoryDocument>) => 
				allRepos.find((repo: GraphDbRepositoryDocument) => (repo.workingDirectory === true))
			),
		);
	}

	/**
	 * convert a repository mongo db document to a repository DTO
	 * @param repository the repository as a mongo db document 
	 * @returns the repository
	 */
	private convertRepositoryDocToDto(repository: GraphDbRepositoryDocument): RepositoryDto {
		const repositoryDto: RepositoryDto = {
			id: repository._id.toString(),
			title: repository.name,
			uri: repository.uri
		};
		return repositoryDto;
	}

	/**
	 * check if an user owns a repo
	 * @param repository the repo
	 * @param user the user
	 * @returns returns (void) if user owns repository, thorws exception otherwise
	 * 
	 */
	private userOwnsRepository(repository: GraphDbRepositoryDocument, user: UserDocument): void {
		const matchingRepo = user.graphDbRepositories.find(
			(_repository: GraphDbRepositoryDocument) => {
				return (repository.equals(_repository));
			}
		);
		if(matchingRepo === undefined) {
			throw new HttpException("not owned by user", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return;
	}

	/**
	 * Deletes an existing repository
	 * @param repository the mongo db repository document
	 * @returns void on success
	 */
	private deleteRepository(repository: GraphDbRepositoryDocument): Observable<void> {
		return this.currentUserService.getCurrentUser().pipe(
			map((user: UserDocument) => this.userOwnsRepository(repository, user)),
			mergeMap(( ) => {
				return from(repository.deleteOne());
			}),
			mergeMap((repository: GraphDbRepositoryDocument) => {
				const requestConfig: AxiosRequestConfig = {
					method: 'DELETE',
					baseURL: 'http://localhost:7200/',
					url: '/repositories/' + repository._id.toString()
				};
				return this.http.request<void>(requestConfig);
			}),
			// map to void
			map(( ) => { return; })
		);
	}

	/**
     * Clears a repository by deleting all triples
     * @param repository the repository to clear as a mongo db document 
     * @returns void if successfull
     */
	private clearRepository(repository: GraphDbRepositoryDocument): Observable<void> {
		return this.currentUserService.getCurrentUser().pipe(
			map((user: UserDocument) => {
				this.userOwnsRepository(repository, user);
				return repository;
			}),
			mergeMap((repository: GraphDbRepositoryDocument) => {
				const requestConfig: AxiosRequestConfig = {
					method: 'DELETE',
					baseURL: 'http://localhost:7200/',
					url: '/repositories/' + repository._id.toString() + '/statements'
				};
				return this.http.request<void>(requestConfig);
			}),
			// map to void
			map(( ) => { return; })
		);
	}

	/**
	 * create a axios request config to create a new repository
	 * TODO: find a better way without forms and creating a .ttl file
	 * @param repositoryId 
	 * @param repositoryName 
	 * @returns the repo config
	 */
	private createRepoConfig(repositoryId: string, repositoryName: string): AxiosRequestConfig {
		// create config as string
		const repoConfigString = this.createRepoConfigString(repositoryId, repositoryName);
		// store config as file as it has to be a file for further steps
		fs.writeFileSync("./temp/repo-config.ttl", repoConfigString);
		// Create form data with the config file
		const form = new FormData();
		form.append('config', fs.createReadStream("./temp/repo-config.ttl"));
		// Build the request. Note that headers have to be calculated from the form
		const reqConfig: AxiosRequestConfig = {
			method: 'POST',
			headers: form.getHeaders(),
			baseURL: 'http://localhost:7200',
			url: '/rest/repositories',
			data: form
		};
		// delete file
		// fs.unlinkSync("./temp/repo-config.ttl");
		return reqConfig;
	}

	/**
	 * helper function
	 * @param repositoryId 
	 * @param repositoryName 
	 * @returns 
	 */
	private createRepoConfigString(repositoryId: string, repositoryName: string): string {
		return `
		@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
		@prefix rep: <http://www.openrdf.org/config/repository#>.
		@prefix sr: <http://www.openrdf.org/config/repository/sail#>.
		@prefix sail: <http://www.openrdf.org/config/sail#>.
		@prefix owlim: <http://www.ontotext.com/trree/owlim#>.
		
		[] a rep:Repository ;
			rep:repositoryID '${repositoryId}' ;
			rdfs:label '${repositoryName}' ;
			rep:repositoryImpl [
				rep:repositoryType "graphdb:SailRepository" ;
				sr:sailImpl [
					sail:sailType "graphdb:Sail" ;
		
					owlim:owlim-license "" ;
		
					owlim:base-URL "http://example.org/graphdb#" ;
					owlim:defaultNS "" ;
					owlim:entity-index-size "200000" ;
					owlim:entity-id-size  "32" ;
					owlim:imports "" ;
					owlim:repository-type "file-repository" ;
					owlim:ruleset "owl-horst-optimized" ;
					owlim:storage-folder "storage" ;
		
					owlim:enable-context-index "false" ;
					owlim:cache-memory "80m" ;
					owlim:tuple-index-memory "80m" ;
		
					owlim:enablePredicateList "false" ;
					owlim:predicate-memory "0%" ;
		
					owlim:fts-memory "0%" ;
					owlim:ftsIndexPolicy "never" ;
					owlim:ftsLiteralsOnly "true" ;
		
					owlim:in-memory-literal-properties "false" ;
					owlim:enable-literal-index "true" ;
					owlim:index-compression-ratio "-1" ;
		
					owlim:check-for-inconsistencies "false" ;
					owlim:disable-sameAs  "false" ;
					owlim:enable-optimization  "true" ;
					owlim:transaction-mode "safe" ;
					owlim:transaction-isolation "true" ;
					owlim:query-timeout  "0" ;
					owlim:query-limit-results  "0" ;
					owlim:throw-QueryEvaluationException-on-timeout "false" ;
					owlim:useShutdownHooks  "true" ;
					owlim:read-only "false" ;
					owlim:nonInterpretablePredicates "http://www.w3.org/2000/01/rdf-schema#label;http://www.w3.org/1999/02/22-rdf-syntax-ns#type;http://www.ontotext.com/owlim/ces#gazetteerConfig;http://www.ontotext.com/owlim/ces#metadataConfig" ;
				]
			].`;
	}

}
