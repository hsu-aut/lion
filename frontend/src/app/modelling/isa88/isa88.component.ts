import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Isa88ModelService } from '../rdf-models/isa88Model.service';
import { Vdi3682ModelService } from '../rdf-models/vdi3682Model.service';
import { Tables } from '../utils/tables';

@Component({
    selector: 'app-isa88',
    templateUrl: './isa88.component.html',
    styleUrls: ['../../app.component.scss','./isa88.component.scss']
})
export class Isa88Component implements OnInit {

    constructor(
    private modelService: Isa88ModelService,
    private vdi3682ModelService: Vdi3682ModelService,
    ) { }

  // util variables
  TableUtil = new Tables();
  currentTable: Array<Record<string, any>> = [];
  tableTitle: string;
  tableSubTitle: string;

  //user input variables
  optionMode: string;
  selectedOption: string;

  // options for mode
  optionsMode: Array<string> = ["Production", "Maintenance"];

  // variables for behavior
  selectOption: Array<string> = [];

  ngOnInit() {
    this.modelService.getISA88BehaviorInfoTable().subscribe((data: Record<string, string>[]) => this.currentTable = data);
    this.vdi3682ModelService.getListOfTechnicalResources().subscribe((data: string[]) => {this.selectOption = data; console.log(data);});
    this.setTableDescription();
  }

  buildInsert() {
    // TODO: errors occur, when preselected selectedOption is not changed
    const mode: string  = this.optionMode;
    const SystemName: string  = this.selectedOption;
    this.modelService.buildISA88(SystemName, mode,"build").subscribe();
  }

  executeInsert() {
    const mode: string = this.optionMode;
    const SystemName: string = this.selectedOption;
    this.modelService.buildISA88(SystemName, mode,"add").subscribe(()=>{
      this.modelService.getISA88BehaviorInfoTable().subscribe((data: Record<string, string>[]) => this.currentTable = data);
    });
  }

  setTableDescription(){
      this.tableTitle = "Available state machine entities in database";
      this.tableSubTitle = undefined;
  }

}
