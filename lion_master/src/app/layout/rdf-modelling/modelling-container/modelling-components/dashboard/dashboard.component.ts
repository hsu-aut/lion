import { Component, OnInit } from '@angular/core';
import { PrefixesService } from '../../../rdf-models/services/prefixes.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {
  // prefix object

  prefixes;

  // Doughnut
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [350, 450, 100, 200, 400, 300, 100, 200, 99];
  public doughnutChartType: string;


  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }



  constructor(private namespaceService: PrefixesService) { }

  ngOnInit() {

    this.doughnutChartType = 'doughnut';
    this.getPrefixes();
    this.buildLabels();

  }

  buildLabels() {
    for (let i = 0; i < this.prefixes.length; i++) {
      this.doughnutChartLabels.push(this.prefixes[i].prefix)
    }
  }

  getPrefixes() {
    this.prefixes = this.namespaceService.getPrefixes();
  }

}
