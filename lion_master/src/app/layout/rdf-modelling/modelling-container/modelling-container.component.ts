import { Component, OnInit } from '@angular/core';
import { PrefixesService } from '../rdf-models/services/prefixes.service';

// initialize backend services
import { GraphOperationsService } from '../rdf-models/services/backEnd/graphOperations.service';
import { QueriesService } from '../rdf-models/services/backEnd/queries.service';
import { RepositoryOperationsService } from '../rdf-models/services/backEnd/repositoryOperations.service';
import { ConfigurationService } from '../rdf-models/services/backEnd/configuration.service'

import { Vdi3682ModelService } from '../rdf-models/vdi3682Model.service';
import { Vdi2206ModelService } from '../rdf-models/vdi2206Model.service';
import { Dinen61360Service } from '../rdf-models/dinen61360Model.service';
import { Isa88ModelService } from '../rdf-models/isa88Model.service';
import { WadlModelService } from '../rdf-models/wadlModel.service';
import { Iso22400_2ModelService } from '../rdf-models/iso22400_2Model.service';
import { DashboardService } from './modelling-components/dashboard/dashboard.service';



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
    private query: QueriesService,
    private graphOperation: GraphOperationsService,
    private repositoryOperation: RepositoryOperationsService,
    private config: ConfigurationService,


    private prefixService: PrefixesService,
    private ISA_Service: Isa88ModelService,
    private DINEIN61360_Service: Dinen61360Service,
    private VDI2206_Service: Vdi2206ModelService,
    private VDI3862_Service: Vdi3682ModelService,
    private Dashboard_Service: DashboardService,
    private wadl_service: WadlModelService,
    private iso22400Service: Iso22400_2ModelService
  ) {

  }

  ngOnInit() {
    // this.getListOfRepos();
    // this.host = this.config.getHost();
    // this.repository = this.config.getRepository();

  }

  // setGraphDBConfig(hostName: string, repositoryName: string) {
  //   this.config.setHost(hostName);
  //   this.config.setRepository(repositoryName);
  //   this.refreshServices();
  // }

  // refreshServices() {
  //   console.info("Refreshing data ...")
  //   this.VDI3862_Service.initializeVDI3682();
  //   this.VDI2206_Service.initializeVDI2206();
  //   this.ISA_Service.initializeISA88();
  //   this.DINEIN61360_Service.initializeDINEN61360();
  //   this.Dashboard_Service.initializeDashboard();
  //   this.wadl_service.initializeWADL();
  //   this.iso22400Service.initializeISO22400_2();
  // }

  // getListOfRepos() {
  //   this.repositoryOperation.getListOfRepositories().subscribe((data: any) => {
  //     this.repositoryList = data
  //   })
  // }

  // createNewRepo(NewRepositoryName: string){
  //   this.repositoryOperation.createRepository(NewRepositoryName).subscribe((data: any) => {
  //     this.getListOfRepos();
  //   })
  // }




}
