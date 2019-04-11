import { Component, OnInit } from '@angular/core';
import { ISA88Insert, ISA88Data, ISA88Variables } from '../../models/isa88Model';
import { SparqlQueriesService} from '../../services/sparql-queries.service';
import { Namespace} from '../../utils/prefixes';

@Component({
  selector: 'app-isa88',
  templateUrl: './isa88.component.html',
  styleUrls: ['./isa88.component.scss']
})
export class Isa88Component implements OnInit {

  constructor(private query:SparqlQueriesService) { }

  isa88 = new ISA88Insert();
  namespaceParser = new Namespace();
  
  // variables for html
  insertString: string;
  optionMode: string;
  optionGranularity: string;
  selectedOption: any;

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

  update(){
    // this.insertString = this.fetchTemplate.getFilledISA88Template(this.selectedOption, this.optionMode, this.optionGranularity);
    // this.query.select().subscribe(selectreturn => this.selectreturn);
    var varia:ISA88Variables = {
      SystemName: this.selectedOption,
      BehaviorClass: this.optionGranularity,
      mode: this.optionMode
    }
    console.log(this.insertString = this.isa88.buildISA88(varia));

  }

  insertISA88(){
    this.query.insert(this.insertString).subscribe((data: any) => {
      this.insertreturn = data
    });
  }

}
