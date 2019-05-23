import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SparqlQueriesService } from '../../../rdf-models/services/sparql-queries.service';
import { EclassSearchService } from '../../../rdf-models/services/eclass-search.service';
import { DownloadService } from '../../../rdf-models/services/download.service';
import { PrefixesService } from '../../../rdf-models/services/prefixes.service';


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
  eclassUrl: string;

  fileUrl;

  // namespace config variables
  PREFIXES: any;
  userPrefix: string;
  userNamespace: string;
  userKey: number;
  activeNamespace: any;




  constructor(private query: SparqlQueriesService,
    private eclass: EclassSearchService,
    private dlService: DownloadService,
    private http: HttpClientModule,
    private prefixService: PrefixesService) {
    this.url = query.getUrl().split('/repositories/');
    this.eclassUrl = eclass.getEclassUrl();
  }

  ngOnInit() {
    //load namespaces initially
    this.PREFIXES = this.prefixService.getPrefixes();
    this.getActiveNamespace();    
  }


  submitGraphConfig(url1: string, rep: string) {
    this.query.setUrl(url1 + '/repositories/' + rep);
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
        url: this.query.getUrl()
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


  loadSelectedFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const line = JSON.parse(reader.result.toString()) as Cfg;
        this.loadDate = 'Loaded Configurations. Date: ' + line.saveDate;
        this.submitBackendConfig(line.backend.eClass);
        this.query.setUrl(line.graphDB.url);
        console.log(line);
      };
      reader.readAsText(event.target.files[0]);

    }
  }

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
  setActiveNamespace(){
    this.prefixService.setActiveNamespace(this.userKey);
    this.getActiveNamespace();
  }
  getActiveNamespace(){
    this.activeNamespace = this.PREFIXES[this.prefixService.getActiveNamespace()];
  }
}
