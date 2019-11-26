import { Component, OnInit } from '@angular/core';
import { PrefixesService } from '../../../rdf-models/services/prefixes.service';
import { QueriesService } from '../../../rdf-models/services/backEnd/queries.service';
import { Vdi3682ModelService } from '../../../rdf-models/vdi3682Model.service';
import { Vdi2206ModelService } from '../../../rdf-models/vdi2206Model.service';
import { Dinen61360Service } from '../../../rdf-models/dinen61360Model.service';
import { Isa88ModelService } from '../../../rdf-models/isa88Model.service';
import { WadlModelService } from '../../../rdf-models/wadlModel.service';

import { DashboardService } from './dashboard.service';

import { DataLoaderService } from '../../../../../shared/services/dataLoader.service';

import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {
  // prefix object

  VDI3682Table = [];
  VDI2206Table = [];
  DINEN61360Table = [];
  ISA88Table = [];
  WADLTable = [];

  VDI3682_TITLE = "Available Processes in Database";
  VDI3682_SUBTITLE = "Click on a cell to to use it for further descriptions.";
  VDI2206_TITLE = "Available structural Elements in Database";
  VDI2206_SUBTITLE = "Click on a cell to to use it for further descriptions.";
  DINEN61360_TITLE = "Available Type Descriptions in Database";
  DINEN61360_SUBTITLE = "Click on a cell to to use it for further descriptions.";
  ISA88_TITLE = "Available state machine entities in Database";
  ISA88_SUBTITLE = "Click on a cell to to use it for further descriptions.";
  WADL_TITLE = "Existing Restful-Services in Database";
  WADL_SUBTITLE = "Click on a cell to to use it for further descriptions.";

  // component UI variables
  numberOfTriples: number = 0;
  activeNamespace: string;

  // Doughnut
  private doughnutChartLabels: string[] = [];
  private doughnutChartData: number[] = [];
  private doughnutChartType: string;
  private doughnutChartExists = false;
  private doughnutChartColors = [
    {
      backgroundColor: [
        'rgba(110, 114, 20, 1)',
        'rgba(118, 183, 172, 1)',
        'rgba(0, 148, 97, 1)',
        'rgba(129, 78, 40, 1)',
        'rgba(129, 199, 111, 1)'
      ]
    }
  ];


  // events
  private chartClicked(e: any): void {
    // console.log(e);
  }

  private chartHovered(e: any): void {
    // console.log(e);
  }

  // table var
  currentTable = [];
  tableTitle: string;
  tableSubTitle: string;
  filterOption: boolean = true;

  constructor(
    private namespaceService: PrefixesService,
    private query: QueriesService,
    private vdi3682Service: Vdi3682ModelService,
    private vdi2206Service: Vdi2206ModelService,
    private dinen61360Service: Dinen61360Service,
    private isa88Service: Isa88ModelService,
    private dashboardService: DashboardService,
    private loadingScreenService: DataLoaderService,
    private wadlService: WadlModelService

  ) { }

  ngOnInit() {

    this.doughnutChartType = 'doughnut';
    this.getChartData();
    this.setTableOption("VDI3682_BUTTON");
    this.currentTable = this.vdi3682Service.getALL_PROCESS_INFO_TABLE();
    this.VDI3682Table = this.vdi3682Service.getALL_PROCESS_INFO_TABLE();
    this.VDI2206Table = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS();
    this.ISA88Table = this.isa88Service.getISA88BehaviorInfo();
    this.DINEN61360Table = this.dinen61360Service.getTABLE_All_TYPES();
    this.WADLTable = this.wadlService.getTABLE_BASE_RESOURCES();
    this.getTriplesCount();
    this.getActiveNamespace();

  }

  refreshData() {
    this.doughnutChartType = 'doughnut';
    this.dashboardService.loadChartData().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.doughnutChartData = data.data;
      this.doughnutChartLabels = data.labels;
    });
    this.VDI3682Table = this.vdi3682Service.getALL_PROCESS_INFO_TABLE();
    this.VDI2206Table = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS();
    this.ISA88Table = this.isa88Service.getISA88BehaviorInfo();
    this.DINEN61360Table = this.dinen61360Service.getTABLE_All_TYPES();
    this.getTriplesCount();
    this.getActiveNamespace();
  }

  getChartData() {
    this.doughnutChartData = this.dashboardService.getChartData().data;
    this.doughnutChartLabels = this.dashboardService.getChartData().labels;
  }

  setTableOption(button) {
    switch (button) {
      case "VDI3682_BUTTON": {
        this.setTable(this.VDI3682Table);
        this.setTableTitles(this.VDI3682_TITLE, this.VDI3682_SUBTITLE);
        break;
      }
      case "VDI2206_BUTTON": {
        this.setTable(this.VDI2206Table);
        this.setTableTitles(this.VDI2206_TITLE, this.VDI2206_SUBTITLE);
        break;
      }
      case "DINEN61360_BUTTON": {
        this.setTable(this.DINEN61360Table);
        this.setTableTitles(this.DINEN61360_TITLE, this.DINEN61360_SUBTITLE);
        break;
      }
      case "ISA88_BUTTON": {
        this.setTable(this.ISA88Table);
        this.setTableTitles(this.ISA88_TITLE, this.ISA88_SUBTITLE);
        break;
      }
      case "WADL_BUTTON": {
        this.setTable(this.WADLTable);
        this.setTableTitles(this.WADL_TITLE, this.WADL_SUBTITLE);
        break;
      }
      default: {
        // no default statements
        break;
      }
    }

  }

  tableClick(individual) {
    let PREFIXES = this.namespaceService.getPrefixes();

    // if known prefix contained in individual, get related triples
    for (let i = 0; i < PREFIXES.length; i++) {
      if (individual.search(PREFIXES[i].prefix) != -1) {
        this.query.getRelatedTriples(individual).pipe(take(1)).subscribe((data: any) => {
          this.currentTable = data
          this.tableTitle = "Triples related to: " + '"' + individual + '"';
          this.tableSubTitle = "Click on a cell to load triples related to this element."
        })
      }
    }
    // if http: or urn: is contained in individial, get related triples
    if (individual.search("http:") != -1 || individual.search("urn:") != -1) {
      this.query.getRelatedTriples(individual).pipe(take(1)).subscribe((data: any) => {
        this.currentTable = data
        this.tableTitle = "Triples related to: " + '"' + individual + '"';
        this.tableSubTitle = "Click on a cell to load triples related to this element."
      })
    } 

  }

  setTable(table) {
    this.currentTable = table;
  }

  setTableTitles(Title, Subtitle) {
    this.tableTitle = Title
    this.tableSubTitle = Subtitle
  }

  getTriplesCount() {
    this.numberOfTriples = 0;
    for (let i = 0; i < this.doughnutChartData.length; i++) {
      this.numberOfTriples = this.numberOfTriples + this.doughnutChartData[i];
    }
  }

  getActiveNamespace() {
    var PREFIXES = this.namespaceService.getPrefixes();
    this.activeNamespace = PREFIXES[this.namespaceService.getActiveNamespace()].namespace;
  }
}
