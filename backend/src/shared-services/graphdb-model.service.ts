import { HttpService, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { GraphDbRepositoryService } from './graphdb-repository.service';

@Injectable()
export class GraphDbModelService {

	constructor(
        private repoService: GraphDbRepositoryService,
        private httpService: HttpService) {}

	async addTurtleFileToGraph(ttlContent: string, graphName: string) {
		const currentRepo = this.repoService.getCurrentRepository();
        
		// promise that is returned by them ethod

		const requestConfig: AxiosRequestConfig = {
			method: 'POST',
			headers: {
				'Content-Type': "text/turtle"
			},
			responseType: 'text',
			data: ttlContent,
			url: `http://localhost:7200/repositories/${currentRepo}/rdf-graphs/service?graph=${graphName}`
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
