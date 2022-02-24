import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TBoxService } from './t-box.service';


@Controller("/lion_BE/t-box")
export class TBoxController {

	constructor(private tboxService: TBoxService) {}

	@Get("properties-by-domain")
	getPropertiesByDomain(@Query("domainClass") domainClass: string): Observable<string[]> {
		const classes = this.tboxService.getPropertiesByDomain(domainClass);
		return classes;
	}

	@Get("class-by-range")
	async getClassByRange(@Query("domainClass") domainClass: string): Promise<string[]> {
		const value = await this.tboxService.getPropertiesByDomain(domainClass);
		console.log("values");
		console.log(value);
		
		return null;
	}

}
