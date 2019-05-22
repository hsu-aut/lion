import { Component, OnInit } from '@angular/core';
import { SparqlQueriesService } from '../../services/sparql-queries.service';
import { ISA88Insert, ISA88Data, ISA88Variables } from '../../models/isa88Model';
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
  isa88 = new ISA88Insert();
  selectString = new ISA88Data();
  selectOption: Array<string> = [];
  selectreturn: any;
  insertreturn: any;


  tableTitle = "MyExampleTable";
  tableExplanation = "Hello World! This is my example table!";

  ngOnInit() {
    this.query.select(this.selectString.SPARQL_SELECT_BEHAVIOR_INFO).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.currentTable = this.TableUtil.buildTable(data);
    });
  }

  tableClicked(asd: any){
    var somedata = asd;
    console.log(somedata)
  }

}
