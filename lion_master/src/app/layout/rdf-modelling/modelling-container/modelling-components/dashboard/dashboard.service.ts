import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrefixesService } from '../../../rdf-models/services/prefixes.service';
import { SparqlQueriesService } from '../../../rdf-models/services/sparql-queries.service';
import { DataLoaderService } from '../../../../../shared/services/dataLoader.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  doughnutChartData: doughnutChart = {
    data: [],
    labels: []
  }

  chartPrefixes: Array<number> = [0, 1, 2, 3, 4, 5]

  constructor(
    private query: SparqlQueriesService,
    private nameService: PrefixesService,
    private loadingScreenService: DataLoaderService
  ) {
    this.initializeDashboard();
  }
  
  public initializeDashboard(){
    this.loadChartData().subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.doughnutChartData = data;
    });
  }

  loadChartData() {
    this.loadingScreenService.startLoading();
    var prefixes = this.nameService.getPrefixes();

    var freshDoughnutChart: doughnutChart = {
      data: [],
      labels: []
    }

    var chartDataObservable = new Observable((observer) => {
      for (let i = 0; i < this.chartPrefixes.length; i++) {
        this.query.getTriplesCount(prefixes[i].namespace).subscribe((data: any) => {

          freshDoughnutChart.data.push(data.length)
          freshDoughnutChart.labels.push(prefixes[i].prefix);

          if (i == (this.chartPrefixes.length - 1)) {
            console.log(freshDoughnutChart)
            observer.next(freshDoughnutChart)
            observer.complete()
          }
        });
      }
    });
    return chartDataObservable
  }

  getChartData(): doughnutChart {
    return this.doughnutChartData
  }

}

export class doughnutChart {

  data: Array<number>;
  labels: Array<string>;

}
