import { Component, OnInit } from '@angular/core';
import { ISA88Insert, ISA88Data, ISA88Variables } from '../../models/isa88Model';
import { SparqlQueriesService} from '../../services/sparql-queries.service';
import { Namespace} from '../../utils/prefixes';
import { DownloadService } from 'src/app/services/download.service';

@Component({
  selector: 'app-isa88',
  templateUrl: './isa88.component.html',
  styleUrls: ['./isa88.component.scss']
})
export class Isa88Component implements OnInit {

  constructor(private query:SparqlQueriesService, private dlService: DownloadService) { }

  isa88 = new ISA88Insert();
  namespaceParser = new Namespace();
  
  //user input variables
  insertString: string;
  optionMode: string;
  optionGranularity: string;
  selectedOption: any;
  insertUrl;

  // variables for behavior 
  selectString = new ISA88Data().SPARQL_SELECT;
  selectOption: ISA88Data["IRI"] = [];
  selectreturn: any;
  insertreturn: any;
  
  ngOnInit() {
    this.query.select(this.selectString).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.selectreturn = data.results.bindings
      this.selectreturn.forEach(element => {
      this.selectOption.push(element.x.value);
        // console.log(element.x.value)
      this.selectedOption = this.selectOption[0]
      
      });
      
      });
  }

  buildInsert(){
    // this.insertString = this.fetchTemplate.getFilledISA88Template(this.selectedOption, this.optionMode, this.optionGranularity);
    // this.query.select().subscribe(selectreturn => this.selectreturn);
    var varia:ISA88Variables = {
      SystemName: this.selectedOption,
      BehaviorClass: this.optionGranularity,
      mode: this.optionMode
    }
    this.insertString = this.isa88.buildISA88(varia);
    const blob = new Blob([this.insertString], { type: 'text/plain' });
    // Dateiname
    const name = 'insert.txt';
    this.dlService.download(blob, name);
  }

  executeInsert(){
    var varia:ISA88Variables = {
      SystemName: this.selectedOption,
      BehaviorClass: this.optionGranularity,
      mode: this.optionMode
    }
    this.insertString = this.isa88.buildISA88(varia);
    this.query.insert(this.insertString).subscribe((data: any) => {
      this.insertreturn = data
    });
  }

}
