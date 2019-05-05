import { HttpClientModule } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';
import { SparqlQueriesService} from '../../services/sparql-queries.service';
import { EclassSearchService } from '../../services/eclass-search.service';
import { Namespace} from '../../utils/prefixes';
import { DownloadService } from 'src/app/services/download.service';
import { formatDate } from '@angular/common';

class Prefix {
  prefix: string;
  namespace: string;
}

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
  savingDate: string;
  loadDate: string;

  url: string[];
  eclassUrl: string;
  PREFIXES: Array<Prefix> = new Namespace().PREFIXES;
  fileUrl;



constructor(private query: SparqlQueriesService,
  private eclass: EclassSearchService,
  private dlService: DownloadService,
  private http: HttpClientModule) {
    this.url = query.getUrl().split('/repositories/');
    this.eclassUrl = eclass.getEclassUrl();
  }

  ngOnInit() {
  }


  submitGraphConfig(url1: string, rep: string) {
    this.query.setUrl(url1 + '/repositories/' + rep);
  }

  submitBackendConfig(eclassUrl: string) {
    this.eclass.setEclassUrl(eclassUrl);
  }


  saveConfiguration(){
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


  loadSelectedFile(event){
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



}
