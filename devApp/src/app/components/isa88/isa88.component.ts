import { Component, OnInit } from '@angular/core';
import { ISA88Insert, ISA88Data, ISA88Variables } from '../../models/isa88Model';
import { SparqlQueriesService } from '../../services/sparql-queries.service';
import { Namespace } from '../../utils/prefixes';
import { DownloadService } from 'src/app/services/download.service';
import { Tables } from '../../utils/tables';

@Component({
  selector: 'app-isa88',
  templateUrl: './isa88.component.html',
  styleUrls: ['./isa88.component.scss']
})
export class Isa88Component implements OnInit {

  constructor(private query: SparqlQueriesService, private dlService: DownloadService) { }
  // util variables
  keys = Object.keys;
  TableUtil = new Tables();
  namespaceParser = new Namespace();
  currentTable: Array<Object> = [];

  //user input variables
  insertString: string;
  optionMode: string;
  optionGranularity: string;
  selectedOption: any;
  insertUrl;

  // variables for behavior 
  isa88 = new ISA88Insert();
  selectString = new ISA88Data();
  selectOption: Array<string> = [];
  selectreturn: any;
  insertreturn: any;

  ngOnInit() {
    this.getTechnicalResources();
    this.getBehaviorInfo();
  }

  buildInsert() {
    var variables = this.getVariables();
    this.insertString = this.isa88.buildISA88(variables);
    const blob = new Blob([this.insertString], { type: 'text/plain' });
    // Dateiname
    const name = 'insert.txt';
    this.dlService.download(blob, name);
  }

  executeInsert() {
    var variables = this.getVariables();
    this.insertString = this.isa88.buildISA88(variables);
    this.query.insert(this.insertString).subscribe((data: any) => {
      this.insertreturn = data
    });
    this.getBehaviorInfo();
  }

  getTechnicalResources() {
    this.query.select(this.selectString.SPARQL_SELECT_TR).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.selectOption = this.TableUtil.buildList(data, 0);
    });
  }

  getBehaviorInfo() {
    this.query.select(this.selectString.SPARQL_SELECT_BEHAVIOR_INFO).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.currentTable = this.TableUtil.buildTable(data);
    });
  }

  getVariables() {
    var varia: ISA88Variables = {
      SystemName: this.selectedOption,
      mode: this.optionMode
    }
    return varia
  }

}
