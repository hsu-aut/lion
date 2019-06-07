import { Component, OnInit } from '@angular/core';

import { concat } from "rxjs";
import { SparqlQueriesService } from '../../../rdf-models/services/sparql-queries.service';
import { EclassSearchService } from '../../../rdf-models/services/eclass-search.service';
import { BackEndRequestsService } from '../../../rdf-models/services/backEndRequests.service';
import { DownloadService } from '../../../rdf-models/services/download.service';
import { PrefixesService } from '../../../rdf-models/services/prefixes.service';

import { Vdi3682ModelService } from '../../../rdf-models/vdi3682Model.service';
import { Vdi2206ModelService } from '../../../rdf-models/vdi2206Model.service';
import { Dinen61360Service } from '../../../rdf-models/dinen61360.service';
import { Isa88ModelService } from '../../../rdf-models/isa88Model.service';
import { DashboardService } from '../../modelling-components/dashboard/dashboard.service';

import { finalize } from 'rxjs/operators';
import { take } from 'rxjs/operators';


interface Cfg {
  saveDate: string;
  graphDB: {
    url: string
  };

  backend: {
    eClass: string
  };
}

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})

export class ConfigurationsComponent implements OnInit {
  // util variables
  keys = Object.keys;
  nameSpaceTableTitle: string = undefined;
  nameSpaceTableSubTitle: string = "Used namespaces and their prefixes are shown below. Click on the table to delete or edit existing namespaces.";

  savingDate: string;
  loadDate: string;

  url: string[];
  hostName: string;
  repositoryName: string;
  newRepositoryname: string;
  repositoryList: Array<string>;

  eclassUrl: string;
  fileUrl;

  // namespace config variables
  PREFIXES: any;
  userPrefix: string;
  userNamespace: string;
  userKey: number;
  activeNamespace: any;

  // graph config
  graphList;
  currentGraph: string;
  newGraph: string;
 


  constructor(
    private query: SparqlQueriesService,
    private backEnd: BackEndRequestsService,
    private eclass: EclassSearchService,
    private dlService: DownloadService,
    private prefixService: PrefixesService,
    private ISA_Service: Isa88ModelService,
    private DINEIN61360_Service: Dinen61360Service,
    private VDI2206_Service: Vdi2206ModelService,
    private VDI3862_Service: Vdi3682ModelService,
    private Dashboard_Service: DashboardService


  ) {

    
  }

  ngOnInit() {
    //load namespaces initially
    this.PREFIXES = this.prefixService.getPrefixes();
    this.getActiveNamespace();
    this.eclassUrl = this.eclass.getEclassUrl();
    // this.eclass.getTBox().pipe(take(1)).subscribe((data: any) => {
    //   // log + assign data and stop loader
    //   console.log(data);
    // });;
    this.getListOfRepos();
    this.hostName = this.query.getHost();
    this.repositoryName = this.query.getRepository();
    this.getCurrentGraphConfig();
  }


  setGraphDBConfig(hostName: string, repositoryName: string) {
    this.query.setHost(hostName);
    this.query.setRepository(repositoryName);
    this.refreshServices();
  }

  submitBackendConfig(eclassUrl: string) {
    this.eclass.setEclassUrl(eclassUrl);
  }


  saveConfiguration() {
    // Inhalt
    const savingTempDate = new Date().toLocaleString();
    this.savingDate = 'Downloaded Configurations. Date: ' + savingTempDate;
    const configs = {
      saveDate: savingTempDate,
      graphDB: {
        url: this.query.getURL()
      },
      backend: {
        eClass: this.eclass.getEclassUrl()
      }
    };
    const data = JSON.stringify(configs, null, '  ');
    // Blob
    const blob = new Blob([data], { type: 'application/json' });
    // Dateiname
    const name = 'lionConfigurations.json';
    // Downloadservice
    this.dlService.download(blob, name);
  }


  // loadSelectedFile(event) {
  //   if (event.target.files && event.target.files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const line = JSON.parse(reader.result.toString()) as Cfg;
  //       this.loadDate = 'Loaded Configurations. Date: ' + line.saveDate;
  //       this.submitBackendConfig(line.backend.eClass);
  //       this.query.setURL(line.graphDB.url);
  //       console.log(line);
  //     };
  //     reader.readAsText(event.target.files[0]);

  //   }
  // }

  prefixTableClick(tableRow) {
    this.userPrefix = tableRow.prefix;
    this.userNamespace = tableRow.namespace;
    for (let i = 0; i < this.PREFIXES.length; i++) {
      if (tableRow.namespace == this.PREFIXES[i].namespace) { this.userKey = i }
    }
  }
  addNamespace() {
    this.prefixService.addNamespace(this.userPrefix, this.userNamespace);
  }

  editNamespace() {
    this.prefixService.editNamespace(this.userKey, this.userPrefix, this.userNamespace);
  }

  deleteNamespace() {
    this.prefixService.deleteNamespace(this.userKey);
  }
  setActiveNamespace() {
    this.prefixService.setActiveNamespace(this.userKey);
    this.getActiveNamespace();
  }
  getActiveNamespace() {
    this.activeNamespace = this.PREFIXES[this.prefixService.getActiveNamespace()];
  }

  loadTBoxes() {

    var ObservableSequence =     concat(
      this.backEnd.loadTBoxes(this.query.getRepository(), "VDI3682"),
      this.backEnd.loadTBoxes(this.query.getRepository(), "WADL"),
      this.backEnd.loadTBoxes(this.query.getRepository(), "ISA88"),
      this.backEnd.loadTBoxes(this.query.getRepository(), "DINEN61360"),
      this.backEnd.loadTBoxes(this.query.getRepository(), "VDI2206"),


    ).pipe(
      finalize(() => this.refreshServices()) // Execute when the observable completes
    )

    ObservableSequence.subscribe((data: any) => console.log(data));

  }

  clearRepository() {
    this.backEnd.clearRepo(this.query.getRepository()).pipe(take(1)).subscribe((data: any) => {
      console.info("Repository cleared ...")
    })
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
    this.query.getListOfRepositories().pipe(take(1)).subscribe((data: any) => {
      this.repositoryList = data
    })
  }

  createNewRepo(NewRepositoryName: string){
    this.backEnd.createRepo(NewRepositoryName).pipe(take(1)).subscribe((data: any) => {
      this.getListOfRepos();
    })
  }

  getCurrentGraphConfig(){
    this.graphList = this.prefixService.getGraphs();
    this.currentGraph = this.graphList[this.prefixService.getActiveGraph()];
  }

  createNamedGraph(newGraphName: string){
    let newGraph = newGraphName;
    if(newGraphName.search("http://") != -1){
      this.prefixService.addGraph(newGraph);
    } else {
      newGraph = "http://" + newGraph
      this.prefixService.addGraph(newGraph);
    }  
    this.getCurrentGraphConfig();
  }
  setActiveGraph(graph: string){
    for (let i = 0; i < this.graphList.length; i++) {
      if(this.graphList[i].search(graph) != -1){
        this.prefixService.setActiveGraph(i);
        this.getCurrentGraphConfig();
      }
    }
  }

  downloadGraph(graph: string){
    this.query.getTriplesOfNamedGraph(graph).pipe(take(1)).subscribe((data: string) => {
      const blob = new Blob([data], { type: 'text' });
      // Dateiname
      const name = graph + '.ttl';
      // Downloadservice
      this.dlService.download(blob, name);
    })
  }

  deleteTriplesOfNamedGraph(graph){
    this.query.deleteTriplesOfNamedGraph(graph).pipe(take(1)).subscribe((data: string) => {
      console.log(data);
    })
  }

  deleteNamedGraph(graph){
    this.query.deleteNamedGraph(graph).pipe(take(1)).subscribe((data: string) => {
      console.log(data);
      for (let i = 0; i < this.graphList.length; i++) {
        if(this.graphList[i].search(graph) != -1){
          this.prefixService.deleteGraph(i);
          this.getCurrentGraphConfig();
        }
      }
    })
  }

}
