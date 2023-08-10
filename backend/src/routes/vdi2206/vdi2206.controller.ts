import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { Vdi2206Service } from './vdi2206.service';
import { Observable } from 'rxjs';
import { SparqlResponse } from '../../models/sparql/SparqlResponse';


@Controller('lion_BE/vdi2206')
export class Vdi2206Controller {
	
	constructor(
		private vdi2206Service: Vdi2206Service
	) { }

	@Get('systems-modules')
	public getSystemsAndModules(): Observable<SparqlResponse> {
		return this.vdi2206Service.selectAllSystemsAndModules();
	}

	@Get('systems')
	public getSystems(): Observable<SparqlResponse> {
		return this.vdi2206Service.selectAllSystems();
	}

	@Get('modules')
	public getModules(): Observable<SparqlResponse> {
		return this.vdi2206Service.selectAllModules();
	}

	@Get('components')
	public getComponents(): Observable<SparqlResponse> {
		return this.vdi2206Service.selectAllComponents();
	}

}
