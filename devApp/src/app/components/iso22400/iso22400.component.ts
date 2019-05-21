import { Component, OnInit } from '@angular/core';
import { SparqlQueriesService } from '../../services/sparql-queries.service';
import { VDI2206DATA, VDI2206INSERT, VDI2206VARIABLES } from '../../models/vdi2206Model';
import { Namespace } from '../../utils/prefixes';
import { Tables } from '../../utils/tables';
import { DownloadService } from 'src/app/services/download.service';

@Component({
  selector: 'app-iso22400',
  templateUrl: './iso22400.component.html',
  styleUrls: ['./iso22400.component.scss']
})
export class ISO22400Component implements OnInit {

  constructor(private query: SparqlQueriesService, private dlService: DownloadService) { }

  namespaceParser = new Namespace();
  TableUtil = new Tables();
  currentTable: Array<Object> = [];

  // stats 
  NoOfSystems: number;
  NoOfModules: number;
  NoOfComponents: number;

  // model data
  modelData = new VDI2206DATA();
  modelInsert = new VDI2206INSERT();
  modelVariables = new VDI2206VARIABLES();

  allStructureInfoContainmentbySys: any = [];
  allStructureInfoContainmentbyMod: any = [];
  allStructureInfoInheritancebySys: any = [];
  allStructureInfoInheritancebyMod: any = [];


  ngOnInit() {
    this.query.select(this.modelData.allStructureInfoContainmentbySys).subscribe((data: any) => {
      // parse prefixes where possible 
      this.namespaceParser.parseToPrefix(data);
      this.currentTable = this.TableUtil.buildTable(data);
    });
  }

  tableClicked(asd: any){
    var somedata = asd;
    console.log(somedata)
  }

}
