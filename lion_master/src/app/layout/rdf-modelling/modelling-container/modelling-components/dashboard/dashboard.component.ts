import { Component, OnInit } from '@angular/core';
import { PrefixesService } from '../../../rdf-models/services/prefixes.service';
import { SparqlQueriesService } from '../../../rdf-models/services/sparql-queries.service';
import { Vdi3682ModelService } from '../../../rdf-models/vdi3682Model.service';
import { Vdi2206ModelService } from '../../../rdf-models/vdi2206Model.service';
import { Dinen61360Service } from '../../../rdf-models/dinen61360.service';
import { Isa88ModelService } from '../../../rdf-models/isa88Model.service';

import { Tables } from '../../../utils/tables';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {
  // prefix object

  prefixes;

  TableUtil = new Tables();


  // Doughnut
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];
  public doughnutChartType: string;


  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  // table var
  currentTable = [];
  tableTitle = "hello World"
  tableSubTitle = "hello world sub"

  constructor(
    private namespaceService: PrefixesService,
    private query: SparqlQueriesService,
    private vdi3682Service: Vdi3682ModelService,
    private vdi2206Service: Vdi2206ModelService,
    private dinen61360Service: Dinen61360Service,
    private isa88Service: Isa88ModelService

    ) { }

  ngOnInit() {

    this.doughnutChartType = 'doughnut';
    this.getPrefixes();
    this.buildChart();
    this.getAllProcessInfo();
    
  }


  buildChart(){

    for (let i = 0; i < 5; i++) {
      var list;
      this.query.getTriplesCount(this.prefixes[i].namespace).subscribe((data: any) => {
        list = this.TableUtil.buildList(data, 0);
        this.doughnutChartData.push(list.length);
        this.doughnutChartLabels.push(this.prefixes[i].prefix);
      });
    }
    
  }

  getPrefixes() {
    this.prefixes = this.namespaceService.getPrefixes();
  }

  // TODO: include other tables dynamically
  getAllProcessInfo() {
    // this.query.select(this.modelData.allProcessInfo).subscribe((data: any) => {
    //   this.namespaceService.parseToPrefix(data);
    //   this.currentTable = this.TableUtil.buildTable(data);
    //   // console.log(this.currentTable)
    //   // parse prefixes where possible 
    // });
  }

  tableClick(individual){
    this.query.getRelatedTriples(individual).subscribe((data: any) => {
      this.namespaceService.parseToPrefix(data);
      this.currentTable = this.TableUtil.buildTable(data);
      this.tableTitle = "Triples related to: " + '"' + individual + '"';
      this.tableSubTitle ="Click on a cell to load triples related to this element."
    })
  }


}
