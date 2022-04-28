import { Controller, Get, Param, Query } from '@nestjs/common';
import { OdpName, OdpInfo } from '@shared/models/odps/odp';
import { OdpService } from './odp.service';

@Controller('/lion_BE/odps')
export class OdpController {
	
	constructor(private odpService: OdpService) { }

	/**
	 * GET list of ODPs
	 * @returns A list of all ODP names. Currently just a static list
	 */
	@Get()
	getListOfOdps(): Promise<Array<OdpInfo>> {
		return this.odpService.getAllOdps();
	}

	/** 
	* INSERT TBOX to repository
	*/
	@Get('/:odpName')
	insertOdpToRepository(@Param('odpName') odpName: OdpName, @Query('version') version: string): any {
		return this.odpService.insertOdp(odpName, version);
	}
}
