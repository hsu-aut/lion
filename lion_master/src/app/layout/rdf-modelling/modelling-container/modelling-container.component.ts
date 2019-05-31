import { Component, OnInit } from '@angular/core';
import { PrefixesService } from '../rdf-models/services/prefixes.service';
import { SparqlQueriesService } from '../rdf-models/services/sparql-queries.service';
import { Vdi3682ModelService } from '../rdf-models/vdi3682Model.service';
import { Vdi2206ModelService } from '../rdf-models/vdi2206Model.service';
import { Dinen61360Service } from '../rdf-models/dinen61360.service';
import { Isa88ModelService } from '../rdf-models/isa88Model.service';
import { DashboardService } from './modelling-components/dashboard/dashboard.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-modelling-container',
  templateUrl: './modelling-container.component.html',
  styleUrls: ['./modelling-container.component.scss']
})
export class ModellingContainerComponent implements OnInit {

  // loading progress
  progressDescription: string;
  progressString: string;
  progress = 0;

  constructor(
    private namespaceService: PrefixesService,
    private query: SparqlQueriesService,
    private vdi3682Service: Vdi3682ModelService,
    private vdi2206Service: Vdi2206ModelService,
    private dinen61360Service: Dinen61360Service,
    private isa88Service: Isa88ModelService,
    private dashboardService: DashboardService
  ) {

  }

  ngOnInit() {

    this.getAllStatuses();

  }

  getAllStatuses() {
    // TODO: implement real loads instead of fake load
    setTimeout(() => {this.setProgressBar(16.67, "Dashboard")}, 300);
    setTimeout(() => {this.setProgressBar(16.67, "VDI 3682")}, 600);
    setTimeout(() => {this.setProgressBar(16.67, "VDI 2206")}, 900);
    setTimeout(() => {this.setProgressBar(16.67, "ISA 88")}, 1200);
    setTimeout(() => {this.setProgressBar(16.67, "DIN EN 61360")}, 1500);
    setTimeout(() => {this.setProgressBar(16.67, "WADL")}, 1800);
  }


  setProgressBar(percentage, description) {
    this.progress = this.progress + percentage;
    this.progressString = this.progress + "%";
    
    if(this.progress >= 97){
      this.progressDescription = "Data successfully loaded!";
    } else {
      this.progressDescription = "Load " + description;
    }
  }



}
