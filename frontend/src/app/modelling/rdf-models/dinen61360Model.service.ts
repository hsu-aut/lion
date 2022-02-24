import { Injectable } from '@angular/core';

import { PrefixesService } from '../../shared/services/prefixes.service';
import { QueriesService } from '../../shared/services/backEnd/queries.service';
import { GraphOperationsService } from '../../shared/services/backEnd/graphOperations.service';
import { DataLoaderService } from '../../shared/services/dataLoader.service';
import { DownloadService } from '../../shared/services/backEnd/download.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SparqlResponse } from '@shared/interfaces/sparql/SparqlResponse';
import { Tables } from '../utils/tables';
import { DINEN61360Variables } from '@shared/interfaces/dinen61360-variables.interface';

@Injectable({
    providedIn: 'root'
})
export class Dinen61360Service {

  private TABLE_ALL_TYPE_INFO = [];
  private TABLE_ALL_INSTANCE_INFO = [];

  private LIST_DATA_TYPES = [];
  private LIST_All_DE = [];
  private LIST_All_DET = [];
  private LIST_All_DEI = [];
  private LIST_LOGIC_INTERPRETATIONS = [];
  private LIST_EXPRESSION_GOALS = [];
  private tableUtil: Tables = new Tables();

  constructor(
    private http: HttpClient,
    private query: QueriesService,
    private graphs: GraphOperationsService,
    private nameService: PrefixesService,
    private loadingScreenService: DataLoaderService,
    private dlService: DownloadService,

  ) {
      this.initializeDINEN61360();
  }

  public initializeDINEN61360(): void {
      this.getTableOfAllTypes().pipe(take(1)).subscribe((data: any) => {
          this.TABLE_ALL_TYPE_INFO = data;
      });
      this.getListOfAllDE().pipe(take(1)).subscribe((data: any) => {
          this.LIST_All_DE = data;
      });
      this.getListOfAllDEI().pipe(take(1)).subscribe((data: any) => {
          this.LIST_All_DEI = data;
      });
      this.getListOfAllDET().pipe(take(1)).subscribe((data: any) => {
          this.LIST_All_DET = data;
      });
      this.getListOfDataTypes().pipe(take(1)).subscribe((data: any) => {
          this.LIST_DATA_TYPES = data;
      });
      this.getTableOfAllInstanceInfo().pipe(take(1)).subscribe((data: any) => {
          this.TABLE_ALL_INSTANCE_INFO = data;
      });
      this.getListOfExpressionGoals().pipe(take(1)).subscribe((data: any) => {
          this.LIST_EXPRESSION_GOALS = data;
      });
      this.getListOfLogicInterpretations().pipe(take(1)).subscribe((data: any) => {
          this.LIST_LOGIC_INTERPRETATIONS = data;
      });
  }
  
  // new methods with requests instead of simple returns
  // TODO: Add return types - cannot be resolved yet as tableUtil doesnt return typed output
  public getTableOfAllTypes(): Observable<any> { 
      return this.http.get<SparqlResponse>("lion_BE/dinen61360/getAllTypes")
          .pipe(map((response: any) => this.tableUtil.buildList(response, 0)));  
  }  
  public getListOfAllDE(): Observable<any> { 
      return this.http.get<SparqlResponse>("lion_BE/dinen61360/getAllDE")
          .pipe(map((response: any) => this.tableUtil.buildList(response, 0)));  
  }
  public getListOfAllDET(): Observable<any> { 
      return this.http.get<SparqlResponse>("lion_BE/dinen61360/getAllDET")
          .pipe(map((response: any) => this.tableUtil.buildList(response, 0)));   
  }
  public getListOfAllDEI(): Observable<any> { 
      return this.http.get<SparqlResponse>("lion_BE/dinen61360/getAllDEI")
          .pipe(map((response: any) => this.tableUtil.buildList(response, 0)));  
  }
  //   public getListOfDataTypes(): Observable<any> { 
  //       return this.http.get<SparqlResponse>("lion_BE/dinen61360/getDataTypes")
  //           .pipe(map((response: any) => this.tableUtil.buildList(response, 0)));
  //   }
  public getListOfDataTypes(): Observable<any> { 
      return this.http.get<SparqlResponse>("lion_BE/dinen61360/getDataTypes")
          .pipe(map((response: any) => ["datatype1","datatype2"]));
  }
  public getTableOfAllInstanceInfo(): Observable<any> {  
      return this.http.get<SparqlResponse>("lion_BE/dinen61360/getAllInstanceInfo")
          .pipe(map((response: any) => this.tableUtil.buildList(response, 0)));  
  }
  public getListOfExpressionGoals(): Observable<any> {  
      return this.http.get<SparqlResponse>("lion_BE/dinen61360/getExpressionGoals")
          .pipe(map((response: any) => this.tableUtil.buildList(response, 0)));  
  }
  public getListOfLogicInterpretations(): Observable<any> {  
      return this.http.get<SparqlResponse>("lion_BE/dinen61360/getLogicInterpretations")
          .pipe(map((response: any) => this.tableUtil.buildList(response, 0)));  
  }

  public modifyInstance(action: string, variables: DINEN61360Variables): Observable<any> {
      const GRAPHS = this.graphs.getGraphs();
      const activeGraph = GRAPHS[this.graphs.getActiveGraph()];

      switch (action) {
      case "add": {
          return this.http.post<void>("lion_BE/dinen61360/modifyInstance?action=add&activeGraph=" + activeGraph, variables);
      }
      case "delete": {
          console.log("not implemented yet");
          break;
      }
      case "build": {
          return this.http.post<string>("lion_BE/dinen61360/modifyType?action=build&activeGraph=" + activeGraph,
              variables, { responseType:'text' as 'json'}).pipe(map((response: string) => {
              const blob = new Blob([response], { type: 'text/plain' });
              const name = 'insert.txt';
              return this.dlService.download(blob, name);    
          }));
      }
      }
  }
  public modifyType(action: string, variables: DINEN61360Variables): Observable<any> {
      const GRAPHS = this.graphs.getGraphs();
      const activeGraph = GRAPHS[this.graphs.getActiveGraph()];

      switch (action) {
      case "add": {
          return this.http.post<void>("lion_BE/dinen61360/modifyType?action=add&activeGraph=" + activeGraph, variables);
      }
      case "delete": {
          console.log("not implemented yet");
          break;
      }
      case "build": {
          return this.http.post<string>("lion_BE/dinen61360/modifyType?action=build&activeGraph=" + activeGraph,
              variables, { responseType:'text' as 'json'}).pipe(map((response: string) => {
              const blob = new Blob([response], { type: 'text/plain' });
              const name = 'insert.txt';
              return this.dlService.download(blob, name);    
          }));
      }
      }

  }
   
}