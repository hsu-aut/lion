import { Injectable } from '@angular/core';
import { PrefixesService } from '../../shared/services/prefixes.service';
import { QueriesService } from '../../shared/services/backEnd/queries.service';
import { GraphOperationsService } from '../../shared/services/backEnd/graphOperations.service';
import { DataLoaderService } from '../../shared/services/dataLoader.service';
import { DownloadService } from '../../shared/services/backEnd/download.service';
import { MessagesService } from '../../shared/services/messages.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ISO224002ElementVariables, ISO224002KPIVariables } from '@shared/interfaces/iso224002-variables.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SparqlResponse } from '@shared/interfaces/sparql/SparqlResponse';
import { toSparqlTable, toSparqlVariableList } from '../utils/rxjs-custom-operators';

@Injectable({
    providedIn: 'root'
})
export class Iso22400_2ModelService {

    private LIST_OF_ELEMENT_GROUPS = [];
    private LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES = [];
    private LIST_OF_KPIs = [];
    private LIST_OF_KPI_GROUPS = [];
    private LIST_OF_ORGANIZATIONAL_ELEMENTS = [];
    private LIST_OF_NON_ORGANIZATIONAL_ELEMENTS = [];
    private LIST_OF_CLASS_CONSTRAINT_ENUM = [];
    private TABLE_ALL_ENTITY_INFO = [];
    private TABLE_ELEMENTS = [];
    private TABLE_KPI = [];

  constructor(

    private http: HttpClient,
    private query: QueriesService,
    private dlService: DownloadService,
    private nameService: PrefixesService,
    private messageService: MessagesService,
    private loadingScreenService: DataLoaderService,
    private graphs: GraphOperationsService
  
  ) {

      this.initializeISO224002();

  }

  initializeISO224002() {
      this.getListOfElementGroups().pipe(take(1)).subscribe((data: any) => {
          this.LIST_OF_ELEMENT_GROUPS = data;
      });
      this.getListOfOrganizationalElementClasses().pipe(take(1)).subscribe((data: any) => {
          this.LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES = data;
      });
      this.getListOfKPIs().pipe(take(1)).subscribe((data: any) => {
          this.LIST_OF_KPIs = data;
      });
      this.getListOfOrganizationalElements().pipe(take(1)).subscribe((data: any) => {
          this.LIST_OF_ORGANIZATIONAL_ELEMENTS = data;
      });
      this.getListOfNonOrganizationalElements().pipe(take(1)).subscribe((data: any) => {
          this.LIST_OF_NON_ORGANIZATIONAL_ELEMENTS = data;
      });
      this.getListOfKPIGroups().pipe(take(1)).subscribe((data: any) => {
          this.LIST_OF_KPI_GROUPS = data;
      });
      this.getTableOfAllEntityInfo().pipe(take(1)).subscribe((data: any) => {
          this.TABLE_ALL_ENTITY_INFO = data;
      });
      this.getTableOfElements().pipe(take(1)).subscribe((data: any) => {
          this.TABLE_ELEMENTS = data;
      });
      this.getTableOfKPIs().pipe(take(1)).subscribe((data: any) => {
          this.TABLE_KPI = data;
      });
  }

  // loaders
//   public loadLIST_OF_KPI_GROUPS() {
//       this.loadingScreenService.startLoading();
//       return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_KPI_GROUPS, 0);
//   }
//   public loadTABLE_ALL_ENTITY_INFO() {
//       this.loadingScreenService.startLoading();
//       return this.query.SPARQL_SELECT_TABLE(this.isoData.SELECT_TABLE_ALL_ENTITY_INFO);
//   }
//   public loadLIST_OF_KPIs() {
//       this.loadingScreenService.startLoading();
//       return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_KPIs, 0);
//   }
//   public loadLIST_OF_ORGANIZATIONAL_ELEMENTS() {
//       this.loadingScreenService.startLoading();
//       return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_ORGANIZATIONAL_ELEMENTS, 0);
//   }
//   public loadLIST_OF_NON_ORGANIZATIONAL_ELEMENTS() {
//       this.loadingScreenService.startLoading();
//       return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_NON_ORGANIZATIONAL_ELEMENTS, 0);
//   }
//   public loadLIST_OF_ELEMENT_GROUPS() {
//       this.loadingScreenService.startLoading();
//       return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_ELEMENT_GROUPS, 0);
//   }
//   public loadLIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES() {
//       this.loadingScreenService.startLoading();
//       return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES, 0);
//   }

  // public loadLIST_OF_ELEMENTS_BY_GROUP(groupNameIRI: string) {
  //     this.loadingScreenService.startLoading();
  //     groupNameIRI = this.nameService.parseToIRI(groupNameIRI);
  //     return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_ELEMENTS_BY_GROUP(groupNameIRI), 0);
  // }

  // public loadLIST_OF_CLASS_CONSTRAINT_ENUM(KPI_Class: string, ConstrainingDataProperty: string) {
  //     this.loadingScreenService.startLoading();
  //     KPI_Class = this.nameService.parseToIRI(KPI_Class);
  //     console.log(KPI_Class);
  //     ConstrainingDataProperty = this.nameService.parseToIRI(ConstrainingDataProperty);
  //     console.log(ConstrainingDataProperty);
  //     return this.query.SPARQL_SELECT_LIST(this.isoData.SELECT_LIST_OF_CLASS_CONSTRAINT_ENUM(KPI_Class, ConstrainingDataProperty), 0);
  // }

//   public loadTABLE_ELEMENTS(){
//       this.loadingScreenService.startLoading();
//       return this.query.SPARQL_SELECT_TABLE(this.isoData.SELECT_TABLE_ELEMENTS);
//   }
//   public loadTABLE_KPI(){
//       this.loadingScreenService.startLoading();
//       return this.query.SPARQL_SELECT_TABLE(this.isoData.SELECT_TABLE_KPI);
//   }


  // old getters
//   public getTABLE_ALL_ENTITY_INFO() {return this.TABLE_ALL_ENTITY_INFO;}
//   public getLIST_OF_KPI_GROUPS() {return this.LIST_OF_KPI_GROUPS;}
//   public getLIST_OF_KPIs() {return this.LIST_OF_KPIs;}
//   public getLIST_OF_ORGANIZATIONAL_ELEMENTS() {return this.LIST_OF_ORGANIZATIONAL_ELEMENTS;}
//   public getLIST_OF_NON_ORGANIZATIONAL_ELEMENTS() {return this.LIST_OF_NON_ORGANIZATIONAL_ELEMENTS;}
//   public getLIST_OF_ELEMENT_GROUPS() {return this.LIST_OF_ELEMENT_GROUPS;}
//   public getLIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES() {return this.LIST_OF_ORGANIZATIONAL_ELEMENT_CLASSES;}
//   public getTABLE_ELEMENTS(){return this.TABLE_ELEMENTS;}
//   public getTABLE_KPI(){return this.TABLE_KPI;}

  // new getters

  public getTableOfAllEntityInfo() {
    return this.http.get<SparqlResponse>("/lion_BE/iso224002/allEntityInfo").pipe(toSparqlTable(), take(1));
  }

  public getListOfKPIGroups(): Observable<Array<string>> {
      return this.http.get<SparqlResponse>("/lion_BE/iso224002/kpiGroups").pipe(toSparqlVariableList(), take(1));
  }  

  public getListOfKPIs(): Observable<Array<string>> {
    return this.http.get<SparqlResponse>("/lion_BE/iso224002/listKPIs").pipe(toSparqlVariableList(), take(1));
  }

  public getListOfOrganizationalElements(): Observable<Array<string>> {
    return this.http.get<SparqlResponse>("/lion_BE/iso224002/orgElements").pipe(toSparqlVariableList(), take(1));
  }

  public getListOfNonOrganizationalElements(): Observable<Array<string>> {
    return this.http.get<SparqlResponse>("/lion_BE/iso224002/nonOrgElements").pipe(toSparqlVariableList(), take(1));
  }

  public getListOfElementGroups(): Observable<Array<string>> {
    return this.http.get<SparqlResponse>("/lion_BE/iso224002/elementGroups").pipe(toSparqlVariableList(), take(1));
  }

  public getListOfOrganizationalElementClasses(): Observable<Array<string>> {
    return this.http.get<SparqlResponse>("/lion_BE/iso224002/orgElementClasses").pipe(toSparqlVariableList(), take(1));
  }

  public getTableOfElements() {
    return this.http.get<SparqlResponse>("/lion_BE/iso224002/elements").pipe(toSparqlTable(), take(1));
  }

  public getTableOfKPIs() {
    return this.http.get<SparqlResponse>("/lion_BE/iso224002/tableKPIs").pipe(toSparqlTable(), take(1));
  }

  public getListOfElementsByGroup(groupNameIRI: string): Observable<Array<string>> {
    const params = new HttpParams()
        .append("constrDataProp", this.nameService.parseToIRI(groupNameIRI));
    console.log(params.toString);
    return this.http.get<SparqlResponse>("/lion_BE/iso224002/listElementsByGroup", {params: params}).pipe(toSparqlVariableList(), take(1));
  }

  public getListOfClassConstraintEnum(KPIClass: string, ConstrainingDataProperty: string): Observable<Array<string>> {
    const params = new HttpParams()
        .append("kpiClass", this.nameService.parseToIRI(KPIClass))
        .append("constrDataProp", this.nameService.parseToIRI(ConstrainingDataProperty));
    console.log(params.toString);
    return this.http.get<SparqlResponse>("/lion_BE/iso224002/listClassConstraints", {params: params}).pipe(toSparqlVariableList(), take(1));
  }

  // setters
//   public setTABLE_ALL_ENTITY_INFO(table) {this.TABLE_ALL_ENTITY_INFO = table;}
//   public setLIST_OF_KPIs(list) {this.LIST_OF_KPIs = list;}
//   public setLIST_OF_ORGANIZATIONAL_ELEMENTS(list) {this.LIST_OF_ORGANIZATIONAL_ELEMENTS = list;}
//   public setLIST_OF_NON_ORGANIZATIONAL_ELEMENTS(list) {this.LIST_OF_NON_ORGANIZATIONAL_ELEMENTS = list;}
//   public setTABLE_ELEMENTS(table) {this.TABLE_ELEMENTS = table;}
//   public setTABLE_KPI(table) {this.TABLE_KPI = table;}

  // builders
  
  public createElement(variables: ISO224002ElementVariables, action: string) {
      
    const GRAPHS = this.graphs.getGraphs();
    const activeGraph = GRAPHS[this.graphs.getActiveGraph()];

    switch (action) {
        case "add": {
            return this.http.post<void>("lion_BE/iso224002/createElement?action=add&activeGraph=" + activeGraph, variables);
        }
        case "delete": {
            this.messageService.addMessage('warning', 'Sorry!', 'This feature has not been implemented yet');
            break;
        }
        case "build": {
            return this.http.post<string>("lion_BE/iso224002/createElement?action=build&activeGraph=" + activeGraph,
                variables, { responseType:'text' as 'json'}).pipe(map((response: string) => {
                const blob = new Blob([response], { type: 'text/plain' });
                const name = 'insert.txt';
                return this.dlService.download(blob, name);    
            }));
        }
    }

  }

  public createKPI(variables: ISO224002KPIVariables, action: string) {
      
    const GRAPHS = this.graphs.getGraphs();
    const activeGraph = GRAPHS[this.graphs.getActiveGraph()];

    switch (action) {
        case "add": {
            return this.http.post<void>("lion_BE/iso224002/createKPI?action=add&activeGraph=" + activeGraph, variables);
        }
        case "delete": {
            this.messageService.addMessage('warning', 'Sorry!', 'This feature has not been implemented yet');
            break;
        }
        case "build": {
            return this.http.post<string>("lion_BE/iso224002/createKPI?action=build&activeGraph=" + activeGraph,
                variables, { responseType:'text' as 'json'}).pipe(map((response: string) => {
                const blob = new Blob([response], { type: 'text/plain' });
                const name = 'insert.txt';
                return this.dlService.download(blob, name);    
            }));
        }
    }
  }

}

export class ISO224002Variables {
  simpleElement: ISO224002ElementVariables
  KPI: ISO224002KPIVariables
}