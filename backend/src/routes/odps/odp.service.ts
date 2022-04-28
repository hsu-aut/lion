import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { OdpName, OdpInfo } from '@shared/models/odps/odp';
import { RepositoryService } from '../../shared-services/repository.service';

@Injectable()
export class OdpService {


	constructor(
		private repoService: RepositoryService,
		private http: HttpService
	) { }

	odpNames = Object.values(OdpName);

	async getAllOdps(): Promise<Array<OdpInfo>> {
		const odpInfos = new Array<OdpInfo>();
		for (const odpName of Object.values(OdpName)) {
			const urls = OdpStore.getOdpInfo(odpName);
			const versions = await this.getOdpVersions(odpName);
			odpInfos.push({...urls, versions});
		}

		return odpInfos;
	}

	private async getOdpVersions(odpName: OdpName): Promise<Array<string>> {
		// ask Github API to get all release versions
		const user = OdpStore.getGithubUser(odpName);
		const repo = OdpStore.getGithubRepo(odpName);
		const githubApiReleaseUrl = `https://api.github.com/repos/${user}/${repo}/releases`;

		// request release info and pick just the tag names
		const results = await firstValueFrom(this.http.get<Array<{tag_name: string, [x:string]: any}>>(githubApiReleaseUrl));
		const versions = results.data.map(data => data.tag_name);
		return versions;
	}

	async insertOdp(patternName: OdpName, version: string): Promise<AxiosResponse<void>> {
		const currentRepo = this.repoService.getCurrentRepository();
		const odpUrl = OdpStore.getOdpVersionUrl(patternName, version);
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
			url: `/repositories/${currentRepo}/statements`
		};

		// TODO: Check if this really returns void 
		return firstValueFrom(this.http.request<void>(reqConfig));
	}

}


export class OdpStore {
	private static odpRegistry = new Map<OdpName, Pick<OdpInfo, "odpUrl"|"odpVersionUrl">>([
		[OdpName.VDI3682,
			{
				odpUrl: "https://github.com/hsu-aut/IndustrialStandard-ODP-VDI3682",
				odpVersionUrl: "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-VDI3682/${version}/VDI3682.owl"
			}
		],
		[OdpName.VDI2206, 
			{
				odpUrl: "https://github.com/hsu-aut/IndustrialStandard-ODP-VDI2206",
				odpVersionUrl: "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-VDI2206/${version}/VDI2206.owl"
			}
		],
		[OdpName.ISA88, 
			{
				odpUrl: "https://github.com/hsu-aut/IndustrialStandard-ODP-ISA88",
				odpVersionUrl: "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-ISA88/${version}/ISA88.owl"
			}
		],
		[OdpName.DINEN61360,
			{
				odpUrl:"https://github.com/hsu-aut/IndustrialStandard-ODP-DINEN61360",
				odpVersionUrl:  "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-DINEN61360/${version}/DINEN61360.owl"
			}
		],
		[OdpName.WADL, 
			{
				odpUrl: "https://github.com/hsu-aut/IndustrialStandard-ODP-WADL",
				odpVersionUrl: "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-WADL/${version}/WADL.owl"
			}
		],
		[OdpName.ISO22400_2,
			{
				odpUrl:"https://github.com/hsu-aut/IndustrialStandard-ODP-ISO22400-2",
				odpVersionUrl: "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-ISO22400-2/${version}/ISO22400-2.owl"
			}],
		[OdpName.OPCUA, 
			{
				odpUrl: "https://github.com/hsu-aut/IndustrialStandard-ODP-OPC-UA/${version}/OpcUa.owl",
				odpVersionUrl: "https://raw.githubusercontent.com/hsu-aut/IndustrialStandard-ODP-OPC-UA/${version}/OpcUa.owl"
			}
		],
	]);

	static getOdpInfo(odpName: OdpName): Pick<OdpInfo, "odpUrl"|"odpVersionUrl"> {
		return this.odpRegistry.get(odpName);
	}

	/**
	 * Returns the URL of an ODP with a specified versions
	 * @param odpName Name of the ODP
	 * @param version Version of the ODP
	 * @returns A versioned URL of an ODP
	 */
	static getOdpVersionUrl(odpName: OdpName, version: string): string {
		const versionUrlWithPlaceholder: string = this.odpRegistry.get(odpName).odpVersionUrl;
		const odpVersionUrl = versionUrlWithPlaceholder.replace("${version}", version);
		return odpVersionUrl;
	}

	static getGithubUser(odpName: OdpName): string {
		const user = this.odpRegistry.get(odpName).odpUrl.match(/github.com\/([\w-_]+)\/([\w-]+)/)[1];
		return user;
	}

	static getGithubRepo(odpName: OdpName): string {
		const repo = this.odpRegistry.get(odpName).odpUrl.match(/github.com\/([\w-_]+)\/([\w-]+)/)[2];
		return repo;
	}

}
