import { Component, OnInit } from '@angular/core';
import { SparqlQueriesService} from '../../services/sparql-queries.service';
import { EclassSearchService } from '../../services/eclass-search.service';
import { Namespace} from '../../utils/prefixes';

class Prefix {
  prefix: string;
  namespace: string;
}

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})





export class ConfigurationsComponent implements OnInit {

  url: string[];
  eclassUrl: string;
  PREFIXES: Array<Prefix> = new Namespace().PREFIXES;



  constructor(private query: SparqlQueriesService, private eclass: EclassSearchService ) { 
    this.url = query.getUrl().split('/repositories/'); 
    this.eclassUrl = eclass.getEclassUrl();
  }

  ngOnInit() {
  }


  submitGraphConfig(url1: string, rep: string){
    this.query.setUrl(url1 + '/repositories/' + rep);
  } 

  submitBackendConfig(eclassUrl: string){
    this.eclass.setEclassUrl(eclassUrl);
  }

}
