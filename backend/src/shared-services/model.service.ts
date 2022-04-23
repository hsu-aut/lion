import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { RepositoryService } from "./repository.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ModelService {
	
	constructor(
		private http: HttpService,
		private repoService: RepositoryService) {}

	async insertTBox(patternName: TBoxPatternName): Promise<AxiosResponse<void>> {
		const currentRepo = this.repoService.getCurrentRepository();
		const patternUrl = TBoxPatternName[patternName];
		const pattern = await this.http.get<any>(patternUrl).toPromise();

		const reqConfig: AxiosRequestConfig = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/rdf+xml',
				'Accept': '*/*'
			},
			responseType: 'text',
			data: pattern.data,
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${currentRepo}/statements`
		};
		
		// TODO: Check if this really returns void 
		return this.http.request<void>(reqConfig).toPromise();
	}

	/**
	 * Returns all triples of the current repository
	 * @returns 
	 */
	getAllTriples(): Observable<AxiosResponse<any>> {
		const currentRepo = this.repoService.getCurrentRepository();
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

		const currentRepo = this.repoService.getCurrentRepository();
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


	async deleteTBox(patternName: TBoxPatternName): Promise<AxiosResponse<void>> {
		const currentRepo = this.repoService.getCurrentRepository();
		
		const patternUrl = TBoxPatternName[patternName];
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

		for (const patternName in TBoxPatternName) {
			this.deleteTBox(TBoxPatternName[patternName]);
		}
	}
}


// TODO: This is pretty bad because the urls are currently hard coded
// -> There is currently no way to set a different version
export enum TBoxPatternName {
	"VDI3682" = "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/blob/v3.0.0/VDI%203682/VDI3682.owl",
	"VDI2206" = "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/blob/v1.4.2/VDI%202206/VDI2206.owl",
	"ISA88" = "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/blob/v1.4.2/ISA%2088/ISA88.owl",
	"DINEN61360" = "https://github.com/hsu-aut/Industrial-Standard-Ontology-Design-Patterns/blob/v1.4.2/DIN%20EN%2061360/DINEN61360.owl",
	"WADL" = "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/blob/v1.4.2/WADL/WADL.owl",
	"ISO22400_2" = "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/blob/v1.4.2/ISO%2022400-2/ISO22400-2.owl",
	"OPCUA" = "https://raw.githubusercontent.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns/blob/v1.4.2/OPC%20UA/OpcUa.owl"
}