import { Component, OnInit } from '@angular/core';
import { PrefixesService } from '../rdf-models/services/prefixes.service';
import { SparqlQueriesService } from '../rdf-models/services/sparql-queries.service';
import { Vdi3682ModelService } from '../rdf-models/vdi3682Model.service';
import { Vdi2206ModelService } from '../rdf-models/vdi2206Model.service';
import { Dinen61360Service } from '../rdf-models/dinen61360.service';
import { Isa88ModelService } from '../rdf-models/isa88Model.service';
import { DashboardService } from './modelling-components/dashboard/dashboard.service';
import { EclassSearchService } from '../rdf-models/services/eclass-search.service';
import { BackEndRequestsService } from '../rdf-models/services/backEndRequests.service';


@Component({
  selector: 'app-modelling-container',
  templateUrl: './modelling-container.component.html',
  styleUrls: ['./modelling-container.component.scss']
})
export class ModellingContainerComponent implements OnInit {
  // utils
  keys = Object.keys;

  // repository definitions
  host: string;
  repository: string;
  newRepositoryname: string;
  repositoryList: Array<string>;


  constructor(
    private eclass: EclassSearchService,
    private query: SparqlQueriesService,
    private backEnd: BackEndRequestsService,
    private prefixService: PrefixesService,
    private ISA_Service: Isa88ModelService,
    private DINEIN61360_Service: Dinen61360Service,
    private VDI2206_Service: Vdi2206ModelService,
    private VDI3862_Service: Vdi3682ModelService,
    private Dashboard_Service: DashboardService
  ) {

  }

  ngOnInit() {
    this.getListOfRepos();
    this.host = this.query.getHost();
    this.repository = this.query.getRepository();

  }

  setGraphDBConfig(hostName: string, repositoryName: string) {
    this.query.setHost(hostName);
    this.query.setRepository(repositoryName);
    this.refreshServices();
  }

  refreshServices() {
    console.info("Refreshing data ...")
    this.VDI3862_Service.initializeVDI3682();
    this.VDI2206_Service.initializeVDI2206();
    this.ISA_Service.initializeISA88();
    this.DINEIN61360_Service.initializeDINEN61360();
    this.Dashboard_Service.initializeDashboard();
  }

  getListOfRepos() {
    this.query.getListOfRepositories().subscribe((data: any) => {
      this.repositoryList = data
    })
  }

  createNewRepo(NewRepositoryName: string){
    this.backEnd.createRepo(NewRepositoryName).subscribe((data: any) => {
      this.getListOfRepos();
    })
  }




}
