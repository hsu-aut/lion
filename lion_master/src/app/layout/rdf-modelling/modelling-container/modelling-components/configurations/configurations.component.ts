import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { concat } from "rxjs";

/* backend services */
import { ConfigurationService } from '../../../../../shared/services/backEnd/configuration.service'
import { GraphOperationsService } from '../../../../../shared/services/backEnd/graphOperations.service';
import { RepositoryOperationsService } from '../../../../../shared/services/backEnd/repositoryOperations.service';


import { DataDescription, FormatDescription } from '../../../../../modelling/utils/formats';
import { PrefixesService } from '../../../../../shared/services/prefixes.service';
import { MessagesService } from '../../../../../shared/services/messages.service';

import { Vdi3682ModelService } from '../../../../../modelling/rdf-models/vdi3682Model.service';
import { Vdi2206ModelService } from '../../../../../modelling/rdf-models/vdi2206Model.service';
import { Dinen61360Service } from '../../../../../modelling/rdf-models/dinen61360Model.service';
import { Isa88ModelService } from '../../../../../modelling/rdf-models/isa88Model.service';
import { DashboardService } from '../../../../../shared/services/dashboard.service';
import { WadlModelService } from '../../../../../modelling/rdf-models/wadlModel.service';
import { Iso22400_2ModelService } from '../../../../../modelling/rdf-models/iso22400_2Model.service';


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
  NoOfNamedGraphs: number = this.graphOperation.getGraphs().length;


  constructor(
    private graphOperation: GraphOperationsService,
    private repositoryOperation: RepositoryOperationsService,
    private config: ConfigurationService,

    private prefixService: PrefixesService,
    private ISA_Service: Isa88ModelService,
    private DINEIN61360_Service: Dinen61360Service,
    private VDI2206_Service: Vdi2206ModelService,
    private VDI3862_Service: Vdi3682ModelService,
    private Dashboard_Service: DashboardService,
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
    this.getListOfRepos();
    this.activeHostname = this.config.getHost();
    this.activeRepository = this.config.getRepository();
    this.getCurrentGraphConfig();

  }

// got it
  setGraphDBConfig(hostName: string, repositoryName: string) {
    if (this.repositoryForm.valid) {
      this.config.setHost(hostName);
      this.config.setRepository(repositoryName);
      this.refreshServices();
      this.activeHostname = this.config.getHost();
      this.activeRepository = this.config.getRepository();
    } else if (this.repositoryForm.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }
  }


  // saveConfiguration() {
  //   // Inhalt
  //   const savingTempDate = new Date().toLocaleString();
  //   this.savingDate = 'Downloaded Configurations. Date: ' + savingTempDate;
  //   const configs = {
  //     saveDate: savingTempDate,
  //     graphDB: {
  //       url: this.query.getHost()
  //     },
  //     backend: {
  //       eClass: this.eclass.getEclassUrl()
  //     }
  //   };
  //   const data = JSON.stringify(configs, null, '  ');
  //   // Blob
  //   const blob = new Blob([data], { type: 'application/json' });
  //   // Dateiname
  //   const name = 'lionConfigurations.json';
  //   // Downloadservice
  //   this.dlService.download(blob, name);
  // }


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
  // got it
  prefixTableClick(tableRow) {
    this.namespaceForm.controls['prefix'].setValue(tableRow.prefix);
    this.namespaceForm.controls['namespace'].setValue(tableRow.namespace);
    for (let i = 0; i < this.PREFIXES.length; i++) {
      if (tableRow.namespace == this.PREFIXES[i].namespace) { this.userKey = i }
    }
  }
  // got it
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
  // got it
  editNamespace() {
    if (this.namespaceForm.valid) {
      this.prefixService.editNamespace(this.userKey, this.namespaceForm.controls['prefix'].value, this.namespaceForm.controls['namespace'].value);
      this.PREFIXES = this.prefixService.getPrefixes();
      this.messageService.addMessage('success', 'Edited namespace', `The namespace ${this.namespaceForm.controls['namespace'].value} has been edited.`)

    } else if (this.namespaceForm.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }
  }
  // got it
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
  // got it
  setActiveNamespace() {
    if (this.namespaceForm.valid) {
      this.prefixService.setActiveNamespace(this.userKey);
      this.getActiveNamespace();
    } else if (this.namespaceForm.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }

  }
  // got it
  getActiveNamespace() {
    this.activeNamespace = this.PREFIXES[this.prefixService.getActiveNamespace()];
  }
// got it
  loadTBoxes() {

    var ObservableSequence = concat(
      this.repositoryOperation.loadTBoxes(this.config.getRepository(), "VDI3682"),
      this.repositoryOperation.loadTBoxes(this.config.getRepository(), "WADL"),
      this.repositoryOperation.loadTBoxes(this.config.getRepository(), "ISA88"),
      this.repositoryOperation.loadTBoxes(this.config.getRepository(), "DINEN61360"),
      this.repositoryOperation.loadTBoxes(this.config.getRepository(), "VDI2206"),
      this.repositoryOperation.loadTBoxes(this.config.getRepository(), "ISO22400_2"),

    ).pipe(
      finalize(() => this.refreshServices()) // Execute when the observable completes
    )

    ObservableSequence.subscribe((data: any) => console.log(data));

  }

  // got it
  clearRepository() {
    this.repositoryOperation.clearRepository(this.config.getRepository()).pipe(take(1)).subscribe((data: any) => {
      console.info("Repository cleared ...")
    })
  }

  // got it
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

  // got it
  getListOfRepos() {
    this.repositoryOperation.getListOfRepositories().pipe(take(1)).subscribe((data: any) => {
      this.repositoryList = data
    })
  }

  // got it
  createNewRepo(NewRepositoryName: string) {
    if (this.newRepository.valid) {
      this.repositoryOperation.createRepository(NewRepositoryName).pipe(take(1)).subscribe((data: any) => {
        this.getListOfRepos();
      })
    } else if (this.newRepository.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }
  }

  getCurrentGraphConfig() {
    this.graphList = this.graphOperation.getGraphs();
    this.currentGraph = this.graphList[this.graphOperation.getActiveGraph()];
    this.NoOfNamedGraphs = this.graphList.length;
  }

  createNamedGraph(newGraphName: string) {
    let newGraph = newGraphName;
    if (newGraphName.search("http://") != -1) {
      this.graphOperation.addGraph(newGraph);
    } else {
      newGraph = "http://" + newGraph
      this.graphOperation.addGraph(newGraph);
    }
    this.getCurrentGraphConfig();
  }
  setActiveGraph(graph: string) {
    for (let i = 0; i < this.graphList.length; i++) {
      if (this.graphList[i].search(graph) != -1) {
        this.graphOperation.setActiveGraph(i);
        this.getCurrentGraphConfig();
      }
    }
  }

  downloadGraph(graph: string, dataFormatName: string) {

    let dataFormat: FormatDescription;

    for (const i in this.dataFormats) {
      // console.log(this.dataFormats[i].formatName)
      if (this.dataFormats[i].formatName == dataFormatName) {
        dataFormat = this.dataFormats[i]
      }

    }

    this.graphOperation.getTriplesOfNamedGraph(graph, dataFormat)

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
    this.graphOperation.deleteTriplesOfNamedGraph(graph).pipe(take(1)).subscribe((data: string) => {
      console.log(data);
      this.refreshServices();
    })
  }

  deleteNamedGraph(graph) {
    this.graphOperation.deleteNamedGraph(graph).pipe(take(1)).subscribe((data: string) => {
      console.log(data);
      for (let i = 0; i < this.graphList.length; i++) {
        if (this.graphList[i].search(graph) != -1) {
          this.graphOperation.deleteGraph(i);
          this.getCurrentGraphConfig();
        }
      }
    })
  }

}
