import { Injectable } from '@angular/core';
import { PrefixesService } from '@shared-services/prefixes.service';
import { QueriesService } from '@shared-services/backEnd/queries.service';
import { GraphOperationsService } from '@shared-services/backEnd/graphOperations.service';
import { DataLoaderService } from '@shared-services/dataLoader.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MessagesService } from '../../shared/services/messages.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { toSparqlTable, toSparqlVariableList } from '../utils/rxjs-custom-operators';
import { SparqlResponse } from '@shared/models/sparql/SparqlResponse';
import { Triple, TripleService } from './triple.service';
import { TboxService } from './tbox.service';

@Injectable({
    providedIn: 'root'
})
export class Vdi2206ModelService {

    private readonly baseUrl = "/lion_BE/vdi2206"
    vdi2206Insert = new VDI2206INSERT();

    constructor(
        private query: QueriesService,
        private http: HttpClient,
        private prefixService: PrefixesService,
        private tboxService: TboxService,
        private loadingScreenService: DataLoaderService,
        private graphs: GraphOperationsService
    ) {

        // this.initializeVDI2206();

    }

    public getSystemsAndModules(): Observable<SparqlResponse> {
        const url = `${this.baseUrl}/systems-modules`;
        return this.http.get<SparqlResponse>(url);
    }

    public getSystems(): Observable<Array<string>> {
        const url = `${this.baseUrl}/systems`;
        return this.http.get<SparqlResponse>(url).pipe(toSparqlVariableList());
    }

    public getModules(): Observable<Array<string>> {
        const url = `${this.baseUrl}/modules`;
        return this.http.get<SparqlResponse>(url).pipe(toSparqlVariableList());
    }

    public getComponents(): Observable<Array<string>> {
        const url = `${this.baseUrl}/components`;
        return this.http.get<SparqlResponse>(url).pipe(toSparqlVariableList());
    }


    // public loadTableStructuralInfoByContainmentBySys() {
    //     const url = `${this.baseUrl}/systems-modules`;
    //     return this.http.get<SparqlResponse>(url);
    // }
    // public loadTableStructuralInfoByContainmentByMod() {
    //     const url = `${this.baseUrl}/systems-modules`;
    //     return this.http.get<SparqlResponse>(url);
    // }
    // public loadTableStructuralInfoByContainmentByCom() {
    //     const url = `${this.baseUrl}/systems-modules`;
    //     return this.http.get<SparqlResponse>(url);
    // }
    // public loadTableStructuralInfoByInheritanceBySys() {
    //     const url = `${this.baseUrl}/systems-modules`;
    //     return this.http.get<SparqlResponse>(url);
    // }
    // public loadTableStructuralInfoByInheritanceByMod() {
    //     const url = `${this.baseUrl}/systems-modules`;
    //     return this.http.get<SparqlResponse>(url);
    // }
    // public loadTableStructuralInfoByInheritanceByCom() {
    //     const url = `${this.baseUrl}/systems-modules`;
    //     return this.http.get<SparqlResponse>(url);
    // }

    public getListOfClasses(): Observable<Array<string>> {
        return this.tboxService.getClassesWithinNamespace('http://www.hsu-ifa.de/ontologies/VDI2206#');
    }

    public getPropertiesByDomain(domainClass: string): Observable<Array<string>> {
        return this.tboxService.getPropertiesByDomain(domainClass);
    }

    public getRangeClasses(property: string): Observable<Array<string>>  {
        property = this.prefixService.parseToIRI(property);
        return this.tboxService.getRangeClasses(property);
    }

    public getClassesOfIndividual(individual: string): Observable<Array<string>> {
        individual = this.prefixService.parseToIRI(individual);
        return this.tboxService.getClassOfIndividualWithinNamespace(individual, 'http://www.hsu-ifa.de/ontologies/VDI2206#');
    }

    public getIndividualsByClass(owlClass: string): Observable<Array<string>> {
        owlClass = this.prefixService.parseToIRI(owlClass);
        this.tboxService.getListOfIndividualsByClass(owlClass, 'http://www.hsu-ifa.de/ontologies/VDI2206#');
    }


    public insertTripel(graph: Tripel): Observable<void> {
        const PREFIXES = this.prefixService.getPrefixes();

        if (graph.subject.search("http://") != -1) {
            //graph.subject = graph.subject;
        } else if (graph.subject.search(":") != -1) {
            graph.subject = this.prefixService.parseToIRI(graph.subject);
        } else {
            graph.subject = activeNamespace + this.prefixService.parseToIRI(graph.subject);
        }
        graph.predicate = this.prefixService.parseToIRI(graph.predicate);
        graph.object = this.prefixService.parseToIRI(graph.object);

        return this.query.executeUpdate(this.vdi2206Insert.createEntity(graph, activeGraph));
    }

    public buildTripel(graph: Tripel): string {
        const PREFIXES = this.prefixService.getPrefixes();

        if (graph.subject.search("http://") != -1) {
            //graph.subject = graph.subject;
        } else if (graph.subject.search(":") != -1) {
            graph.subject = this.prefixService.parseToIRI(graph.subject);
        } else {
            graph.subject = activeNamespace + this.prefixService.parseToIRI(graph.subject);
        }
        graph.predicate = this.prefixService.parseToIRI(graph.predicate);
        graph.object = this.prefixService.parseToIRI(graph.object);

        return this.vdi2206Insert.createEntity(graph, activeGraph);
    }

}

export class VDI2206DATA {

}


export class Tripel {
    constructor(
        public subject: string,
        public predicate: string,
        public object: string
    ) {}
}


export class VDI2206INSERT {

    public createEntity(graph: Tripel, activeGraph: string): string {
        const insertString = `
      INSERT {
        GRAPH <${activeGraph}>{
          ?subject ?predicate ?object;
          a owl:NamedIndividual.}
      } WHERE {
          BIND(IRI(STR("${graph.subject}")) AS ?subject).
          BIND(IRI(STR("${graph.predicate}")) AS ?predicate).
          BIND(IRI(STR("${graph.object}")) AS ?object).
      }`;
        console.log(insertString);
        return insertString;
    }


}
