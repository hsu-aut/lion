import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { OdpInfo, OdpName } from "@shared/models/odps/odp";
import { firstValueFrom } from "rxjs";

@Injectable()
export class OdpStore {

	constructor(
        private http: HttpService
	){}
	
	/**
	 * Registry of all existing ODPs. Add URL and version URL (with placeholder!) to this registry
	 */
	private odpRegistry = new Map<OdpName, Pick<OdpInfo, "odpUrl"|"odpVersionUrl">>([
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

	odpCache = {dateCached: 0, odpInfos: new Array<OdpInfo>()};


	async getAllOdpInfo(): Promise<Array<OdpInfo>> {
		const millis = (Date.now()-this.odpCache.dateCached);
		const cacheAgeMinutes = Math.floor(millis / (1000 * 60));
        
		if(cacheAgeMinutes < 120 ) {
			return this.odpCache.odpInfos;
		} else {
			// get versions from Github and set new cache date
			for (const odpName of Object.values(OdpName)) {
				const urls = this.getOdpInfo(odpName);
				const versions = await this.getOdpVersions(odpName);
				this.odpCache.odpInfos.push({name: odpName, ...urls, versions});
			}
			this.odpCache.dateCached = Date.now();
            
			return this.odpCache.odpInfos;
		}
	}


	getOdpInfo(odpName: OdpName): Pick<OdpInfo, "odpUrl"|"odpVersionUrl"> {
		return this.odpRegistry.get(odpName);
	}

	/**
	 * Returns the URL of an ODP with a specified versions
	 * @param odpName Name of the ODP
	 * @param version Version of the ODP
	 * @returns A versioned URL of an ODP
	 */
	getOdpVersionUrl(odpName: OdpName, version: string): string {
		const versionUrlWithPlaceholder: string = this.odpRegistry.get(odpName).odpVersionUrl;
		const odpVersionUrl = versionUrlWithPlaceholder.replace("${version}", version);
		return odpVersionUrl;
	}

	getGithubUser(odpName: OdpName): string {
		const user = this.odpRegistry.get(odpName).odpUrl.match(/github.com\/([\w-_]+)\/([\w-]+)/)[1];
		return user;
	}

	getGithubRepo(odpName: OdpName): string {
		const repo = this.odpRegistry.get(odpName).odpUrl.match(/github.com\/([\w-_]+)\/([\w-]+)/)[2];
		return repo;
	}

	async getOdpVersions(odpName: OdpName): Promise<Array<string>> {
		// ask Github API to get all release versions
		const user = this.getGithubUser(odpName);
		const repo = this.getGithubRepo(odpName);
		const githubApiReleaseUrl = `https://api.github.com/repos/${user}/${repo}/releases`;

		// request release info and pick just the tag names
		const results = await firstValueFrom(this.http.get<Array<{tag_name: string, [x:string]: any}>>(githubApiReleaseUrl));
		const versions = results.data.map(data => data.tag_name);
		return versions;
	}

}
