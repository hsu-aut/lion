import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { OdpName, OdpInfo } from '@shared/models/odps/odp';
import { RepositoryService } from '../../shared-services/repository.service';
import { OdpStore } from './odp-store.service';

@Injectable()
export class OdpService {


	constructor(
		private odpStore: OdpStore,
		private repoService: RepositoryService,
		private http: HttpService
	) { }

	odpNames = Object.values(OdpName);

	getAllOdps(): Promise<Array<OdpInfo>> {
		const odpInfos = this.odpStore.getAllOdpInfo();
		return odpInfos;
	}

	

	async insertOdp(patternName: OdpName, version: string): Promise<AxiosResponse<void>> {
		const currentRepo =  await firstValueFrom(this.repoService.getWorkingRepository());
		const odpUrl = this.odpStore.getOdpVersionUrl(patternName, version);
		const odp = await firstValueFrom(this.http.get<any>(odpUrl));

		const reqConfig: AxiosRequestConfig = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/rdf+xml',
				'Accept': '*/*'
			},
			responseType: 'text',
			data: odp.data,
			baseURL: 'http://localhost:7200/',
			url: `/repositories/${currentRepo.id}/statements`
		};

		// TODO: Check if this really returns void 
		return firstValueFrom(this.http.request<AxiosResponse<void>>(reqConfig).pipe(map(res => res.data)));
	}

}

