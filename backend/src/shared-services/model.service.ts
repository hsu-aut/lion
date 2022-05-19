import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { RepositoryService } from "./repository.service";
import { firstValueFrom, Observable } from "rxjs";
import { OdpName } from "@shared/models/odps/odp";
import { map } from "rxjs/operators";

@Injectable()
export class ModelService {
	
	constructor(
		private http: HttpService,
		private repoService: RepositoryService) {}


	/**
	 * Returns all triples of the current repository
	 * @returns 
	 */
	getAllTriples(): Observable<AxiosResponse<any>> {
		const currentRepo = this.repoService.getWorkingRepository();
		const reqConfig : AxiosRequestConfig = {
			method: 'GET',
			headers: {
				'Accept': 'application/rdf+xml'
			},
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${currentRepo}/statements`
		};

		return this.http.request<any>(reqConfig).pipe(map(res => res.data));
	}


	async getAllABoxTriples(): Promise<AxiosResponse<any>> {
		// TODO: This is pretty bad because after export, the TBox is gone
		// Has this ever been used???
		await this.deleteAllTBoxes();

		const currentRepo = this.repoService.getWorkingRepository();
		const reqConfig : AxiosRequestConfig= {
			method: 'GET',
			headers: {
				'Accept': 'application/rdf+xml'
			},
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${currentRepo}/statements`
		};

		return this.http.request<any>(reqConfig).toPromise();
	}


	async deleteTBox(patternName: OdpName): Promise<AxiosResponse<void>> {
		const currentRepo = this.repoService.getWorkingRepository();
		
		const patternUrl = OdpName[patternName];
		const pattern = await this.http.get<any>(patternUrl).toPromise();

		const reqConfig: AxiosRequestConfig = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/rdf+xml',
				'Accept': '*/*'
			},
			responseType: 'text',
			data: pattern.data,
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${currentRepo}/statements`
		};

		return this.http.request<void>(reqConfig).toPromise();
	}


	deleteAllTBoxes() {
		// TODO: pattern was previously hard coded, like so:
		// const pattern = "VDI3682";
		// Has this ever been used? -> Check if it has and check if it works...

		for (const patternName in OdpName) {
			this.deleteTBox(OdpName[patternName]);
		}
	}
}

