import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { RepositoryService } from './repository.service';

@Injectable()
export class GraphDbModelService {

	constructor(
        private repoService: RepositoryService,
        private httpService: HttpService) {}

	async addTurtleFileToGraph(ttlContent: string, graphName: string) {
		const currentRepo = this.repoService.getWorkingRepository();
        
		// promise that is returned by them ethod

		const requestConfig: AxiosRequestConfig = {
			method: 'POST',
			headers: {
				'Content-Type': "text/turtle"
			},
			responseType: 'text',
			data: ttlContent,
			url: `${process.env.GRAPHDB_BASE_URL}repositories/${currentRepo}/rdf-graphs/service?graph=${graphName}`
		};

		try {
			const response = await this.httpService.request(requestConfig).toPromise();
			return {
				status: response.status,
				data: JSON.stringify(response.data)
			};
		} catch (error) {
			console.log(`Error while inserting graph to graphDB. Repo: '${currentRepo}', graph: '${graphName}'`);
			throw error;
		}
	}

}
