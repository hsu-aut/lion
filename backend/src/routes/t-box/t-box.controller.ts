import { Controller, Get, Param, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { TBoxService } from './t-box.service';


@Controller("/lion_BE/t-box")
export class TBoxController {

	constructor(private tboxService: TBoxService) {}

	@Get("properties-by-domain")
	getPropertiesByDomain(@Query("domainClass") domainClass: string): Observable<SparqlResponse> {
		return this.tboxService.getPropertiesByDomain(domainClass);
	}

	@Get("classes-of-individual")
	getClassOfIndividual(@Query("individual") individual:string, @Query("namespace") namespace?: string): Observable<SparqlResponse> {
		return this.tboxService.getClassesOfIndividual(individual, namespace);
	}

	@Get("classes-in-namespace/:namespace")
	getClassesInNamespace(@Param("namespace") namespace: string): Observable<SparqlResponse>{
		return this.tboxService.getClassesInNamespace(namespace);
	}

	@Get("objectproperties-in-namespace/:namespace")
	getObjectPropertiesInNamespace(@Param("namespace") namespace: string): Observable<SparqlResponse>{
		return this.tboxService.getObjectPropertiesInNamespace(namespace);
	}

	@Get("dataproperties-in-namespace/:namespace")
	getDataPropertiesInNamespace(@Param("namespace") namespace: string): Observable<SparqlResponse>{
		return this.tboxService.getDataPropertiesInNamespace(namespace);
	}

	@Get("range-classes")
	getRangeClasses(@Query("property") property: string): Observable<SparqlResponse> {
		return this.tboxService.getRangeClasses(property);
	}

	@Get("individuals-by-class")
	getIndividualsByClass(@Query("class") individualsClass: string): Observable<SparqlResponse> {
		return this.tboxService.getIndividualsByClass(individualsClass);
	}

}
