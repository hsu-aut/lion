import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { RepositoryService } from "./repository.service";
import { Observable, take } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class TBoxService {

	constructor(
		private http: HttpService,
		private repoService: RepositoryService) { }


	//	async insertTBox(patternName: TBoxPatternName): Promise<AxiosResponse<void>> {
	insertTBox(patternName: TBoxPatternName): Observable<AxiosResponse<any>> {

		console.log(patternName);
		const currentRepo = this.repoService.getCurrentRepository();
		const patternUrl = TBoxPatternName[patternName];
		console.log(patternName);
		let reqConfig: AxiosRequestConfig;
		
		this.http.get<any>(patternUrl).pipe(take(1)).subscribe((data:any) => {
	
			reqConfig = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/rdf+xml',
					'Accept': '*/*'
				},
				responseType: 'text',
				data: data,
				baseURL: 'http://localhost:7200/',
				url: `/repositories/${currentRepo}/statements`
			};
			console.log("1");
			this.http.request<void>(reqConfig);
			//	console.log(reqConfig);
		});
		return null;
		// TODO: Check if this really returns void 
		//return this.http.request<void>(pattern);
	}

	/**
	 * Returns all triples of the current repository
	 * @returns 
	 */
	getAllTriples(): Observable<AxiosResponse<any>> {
		const currentRepo = this.repoService.getCurrentRepository();
		const reqConfig: AxiosRequestConfig = {
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
		const reqConfig: AxiosRequestConfig = {
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
	"VDI3682" = "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-VDI3682/master/VDI%203682/VDI3682.owl",
	"VDI2206" = "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-VDI2206/master/VDI%202206/VDI2206.owl",
	"ISA88" = "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-ISA88/master/ISA%2088/ISA88.owl",
	"DINEN61360" = "https://github.com/hsu-aut/Industrial-Standard-Ontology-Design-Patterns/master/DIN%20EN%2061360/DINEN61360.owl",
	"WADL" = "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-WADL/master/WADL/WADL.owl",
	"ISO22400_2" = "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-ISO22400-2/master/ISO%2022400-2/ISO22400-2.owl",
	"OPCUA" = "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-OPC-UA/master/OPC%20UA/OpcUa.owl"
}
// Delete the previous enumeration and uncomment the bottom one when Tom has refactored the ODP structure.
/* 
export enum TBoxPatternName { 
	"VDI3682" = "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-VDI3682/v1.4.2/VDI3682.owl",
	"VDI2206" = "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-VDI2206/v1.4.2/VDI2206.owl",
	"ISA88" = "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-ISA88/master/v1.4.2/ISA88.owl",
	"DINEN61360" = "https://github.com/hsu-aut/Industrial-Standard-Ontology-Design-Patterns/v1.4.2/DINEN61360.owl",
	"WADL" = "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-WADL/v1.4.2/WADL.owl",
	"ISO22400_2" = "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-ISO22400-2/v1.4.2/ISO22400-2.owl",
	"OPCUA" = "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-OPC-UA/v1.4.2/OpcUa.owl"
}
*/