import { Component, OnInit } from '@angular/core';
import { ISA88Insert, ISA88Data, ISA88Variables } from './models/isa88Model';
import { SparqlQueriesService} from './services/sparql-queries.service';
import { Namespace} from './utils/prefixes';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'devApp';

  constructor(private query:SparqlQueriesService){}

  // isa88 = new ISA88Insert();
  // namespaceParser = new Namespace();
  
  // // variables for html
  // insertString: string;
  // optionMode: string;
  // optionGranularity: string;
  // selectedOption: any;

  // // variables for behavior 
  // selectString = new ISA88Data().SPARQL_SELECT;
  // selectOption: ISA88Data["IRI"] = [];
  // selectreturn: any;
  

  ngOnInit() {
 


      // this.query.select(this.selectString).subscribe((data: any) => {
      // this.namespaceParser.parseToPrefix(data);
      // this.selectreturn = data.results.bindings
      // this.selectreturn.forEach(element => {
      // this.selectOption.push(element.x.value);
      //   // console.log(element.x.value)
      // this.selectedOption = this.selectOption[0]
      
      // });
      
      // });

      
      



      // testing the prefix parser
  }

  
 
  // varia:ISA88variables = {
  //   SystemName: this.SystemName,
  //   BehaviorClass: "System_Behavior",
  //   mode: "M"
  // }
  
  // varia = {
  //   x: "yolo",
  //   y: "solo"
  // }
  

  // update(){
  // // this.insertString = this.fetchTemplate.getFilledISA88Template(this.selectedOption, this.optionMode, this.optionGranularity);
  // // this.query.select().subscribe(selectreturn => this.selectreturn);

  // var varia:ISA88Variables = {
  //   SystemName: this.selectedOption,
  //   BehaviorClass: this.optionGranularity,
  //   mode: this.optionMode
  // }
  // this.insertString = this.isa88.buildISA88(varia);
  



  // console.log(this.selectreturn);
  // this.selectreturn = this.query.select().subscribe();
  
  // }
  
  
}
