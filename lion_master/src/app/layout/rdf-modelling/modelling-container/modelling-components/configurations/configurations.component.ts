import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { concat } from "rxjs";
import { SparqlQueriesService } from '../../../rdf-models/services/sparql-queries.service';
import { EclassSearchService } from '../../../rdf-models/services/eclass-search.service';
import { BackEndRequestsService } from '../../../rdf-models/services/backEndRequests.service';
import { DownloadService } from '../../../rdf-models/services/download.service';
import { DataDescription } from '../../../utils/formats';
import { FormatDescription } from '../../../utils/formats';
import { PrefixesService } from '../../../rdf-models/services/prefixes.service';
import { DataLoaderService } from '../../../../../shared/services/dataLoader.service';
import { MessagesService } from '../../../../../shared/services/messages.service';

import { Vdi3682ModelService } from '../../../rdf-models/vdi3682Model.service';
import { Vdi2206ModelService } from '../../../rdf-models/vdi2206Model.service';
import { Dinen61360Service } from '../../../rdf-models/dinen61360Model.service';
import { Isa88ModelService } from '../../../rdf-models/isa88Model.service';
import { DashboardService } from '../../modelling-components/dashboard/dashboard.service';
import { WadlModelService } from '../../../rdf-models/wadlModel.service';
import { Iso22400_2ModelService } from '../../../rdf-models/iso22400_2Model.service';


import { finalize } from 'rxjs/operators';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['../../../../../../app/app.component.scss', './configurations.component.scss']
})

export class ConfigurationsComponent implements OnInit {
  // util variables
  keys = Object.keys;

  savingDate: string;
  loadDate: string;
  dataDescription = new DataDescription();
  dataFormats = this.dataDescription.ContentTypes;

  url: string[];
  // hostName: string;
  // repositoryName: string;
  // newRepositoryname: string;


  eclassUrl: string;
  fileUrl;

  // forms
  namespaceForm = this.fb.group({
    prefix: [undefined, [Validators.required, Validators.pattern('^[a-z|A-Z|0-9]+[^:]?:{1}$')]],
    namespace: [undefined, [Validators.required, Validators.pattern('(\w*(http:\/\/)\w*)|(\w*(urn:)\w*)')]],
  })
  graph = this.fb.control('', Validators.required);
  dataFormat = this.fb.control('', Validators.required);
  newGraph = this.fb.control('', [Validators.required, Validators.pattern('(^((?!http).)*$)'), Validators.pattern('([-a-zA-Z0-9()@:%_\+.~#?&//=]){1,}')]);
  repositoryForm = this.fb.group({
    hostName: [undefined, [Validators.required, Validators.pattern('(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}')]],
    repositoryName: [undefined, [Validators.required, Validators.pattern('[-a-zA-Z0-9_+]+')]],
  })
  newRepository = this.fb.control('', [Validators.required, Validators.pattern('(^((?!http).)*$)')]);

  // namespace config variables
  PREFIXES: any;
  userKey: number;
  activeNamespace: any;

  // repository config
  repositoryList: Array<string>;
  activeRepository: string;
  activeHostname: string;

  // graph config
  graphList;
  currentGraph: string;

  // stats
  NoOfNamespaces: number = this.prefixService.getPrefixes().length;
  NoOfNamedGraphs: number = this.prefixService.getGraphs().length;


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
    private Dashboard_Service: DashboardService,
    private DataLoaderService: DataLoaderService,
    private WadlModelService: WadlModelService,
    private Iso22400_2ModelService: Iso22400_2ModelService,
    private fb: FormBuilder,
    private messageService: MessagesService,


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
    this.activeHostname = this.query.getHost();
    this.activeRepository = this.query.getRepository();
    this.getCurrentGraphConfig();

  }


  setGraphDBConfig(hostName: string, repositoryName: string) {
    if (this.repositoryForm.valid) {
      this.query.setHost(hostName);
      this.query.setRepository(repositoryName);
      this.refreshServices();
      this.activeHostname = this.query.getHost();
      this.activeRepository = this.query.getRepository();
    } else if (this.repositoryForm.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }
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
    this.namespaceForm.controls['prefix'].setValue(tableRow.prefix);
    this.namespaceForm.controls['namespace'].setValue(tableRow.namespace);
    for (let i = 0; i < this.PREFIXES.length; i++) {
      if (tableRow.namespace == this.PREFIXES[i].namespace) { this.userKey = i }
    }
  }
  addNamespace() {
    if (this.namespaceForm.valid) {
      this.prefixService.addNamespace(this.namespaceForm.controls['prefix'].value, this.namespaceForm.controls['namespace'].value);
      this.PREFIXES = this.prefixService.getPrefixes();
      this.NoOfNamespaces = this.PREFIXES.length;
      this.messageService.addMessage('success', 'Added namespace', `The namespace ${this.namespaceForm.controls['namespace'].value} has been added.`)

    } else if (this.namespaceForm.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }
  }
  editNamespace() {
    if (this.namespaceForm.valid) {
      this.prefixService.editNamespace(this.userKey, this.namespaceForm.controls['prefix'].value, this.namespaceForm.controls['namespace'].value);
      this.PREFIXES = this.prefixService.getPrefixes();
      this.messageService.addMessage('success', 'Edited namespace', `The namespace ${this.namespaceForm.controls['namespace'].value} has been edited.`)

    } else if (this.namespaceForm.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }
  }
  deleteNamespace() {
    if (this.namespaceForm.valid) {
      this.prefixService.deleteNamespace(this.userKey);
      this.PREFIXES = this.prefixService.getPrefixes();
      this.NoOfNamespaces = this.PREFIXES.length;
      this.messageService.addMessage('success', 'Deleted namespace', `The namespace ${this.namespaceForm.controls['namespace'].value} has been deleted.`)

    } else if (this.namespaceForm.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }
  }
  setActiveNamespace() {
    if (this.namespaceForm.valid) {
      this.prefixService.setActiveNamespace(this.userKey);
      this.getActiveNamespace();
    } else if (this.namespaceForm.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }

  }
  getActiveNamespace() {
    this.activeNamespace = this.PREFIXES[this.prefixService.getActiveNamespace()];
  }

  loadTBoxes() {

    var ObservableSequence = concat(
      this.backEnd.loadTBoxes(this.query.getRepository(), "VDI3682"),
      this.backEnd.loadTBoxes(this.query.getRepository(), "WADL"),
      this.backEnd.loadTBoxes(this.query.getRepository(), "ISA88"),
      this.backEnd.loadTBoxes(this.query.getRepository(), "DINEN61360"),
      this.backEnd.loadTBoxes(this.query.getRepository(), "VDI2206"),
      this.backEnd.loadTBoxes(this.query.getRepository(), "ISO22400_2"),

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
    this.WadlModelService.initializeWADL();
    this.Iso22400_2ModelService.initializeISO22400_2();
  }

  getListOfRepos() {
    this.query.getListOfRepositories().pipe(take(1)).subscribe((data: any) => {
      this.repositoryList = data
    })
  }

  createNewRepo(NewRepositoryName: string) {
    if (this.newRepository.valid) {
      this.backEnd.createRepo(NewRepositoryName).pipe(take(1)).subscribe((data: any) => {
        this.getListOfRepos();
      })
    } else if (this.newRepository.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }

  }

  getCurrentGraphConfig() {
    this.graphList = this.prefixService.getGraphs();
    this.currentGraph = this.graphList[this.prefixService.getActiveGraph()];
    this.NoOfNamedGraphs = this.graphList.length;
  }

  createNamedGraph(newGraphName: string) {
    let newGraph = newGraphName;
    if (newGraphName.search("http://") != -1) {
      this.prefixService.addGraph(newGraph);
    } else {
      newGraph = "http://" + newGraph
      this.prefixService.addGraph(newGraph);
    }
    this.getCurrentGraphConfig();
  }
  setActiveGraph(graph: string) {
    for (let i = 0; i < this.graphList.length; i++) {
      if (this.graphList[i].search(graph) != -1) {
        this.prefixService.setActiveGraph(i);
        this.getCurrentGraphConfig();
      }
    }
  }

  downloadGraph(graph: string, dataFormatName: string) {

    let dataFormat: FormatDescription;

    for (const i in this.dataFormats) {
      // console.log(this.dataFormats[i].formatName)
      if(this.dataFormats[i].formatName == dataFormatName){
        dataFormat = this.dataFormats[i]
      }

    }

    this.query.getTriplesOfNamedGraph(graph, dataFormat)

    // .pipe(take(1)).subscribe((data: string) => {
    //   data = JSON.stringify(data)
    //   console.log(data)
    //   const blob = new Blob([data], { type: 'text' });
    //   // Dateiname
    //   const name = graph + '.ttl';
    //   // Downloadservice
    //   this.dlService.download(blob, name);
    // })
  }

  deleteTriplesOfNamedGraph(graph) {
    this.query.deleteTriplesOfNamedGraph(graph).pipe(take(1)).subscribe((data: string) => {
      console.log(data);
      this.refreshServices();
    })
  }

  deleteNamedGraph(graph) {
    this.query.deleteNamedGraph(graph).pipe(take(1)).subscribe((data: string) => {
      console.log(data);
      for (let i = 0; i < this.graphList.length; i++) {
        if (this.graphList[i].search(graph) != -1) {
          this.prefixService.deleteGraph(i);
          this.getCurrentGraphConfig();
        }
      }
    })
  }

}
