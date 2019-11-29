import { Component, OnInit } from '@angular/core';
import { Isa88ModelService, ISA88Insert, ISA88Variables } from '../rdf-models/isa88Model.service';
import { Vdi3682ModelService } from '../rdf-models/vdi3682Model.service';
import { Tables } from '../utils/tables';
import { DownloadService } from '../../shared/services/backEnd/download.service';

import { DataLoaderService } from '../../shared/services/dataLoader.service';
import { take } from 'rxjs/operators';




@Component({
  selector: 'app-isa88',
  templateUrl: './isa88.component.html',
  styleUrls: ['../../app.component.scss','./isa88.component.scss']
})
export class Isa88Component implements OnInit {

  constructor(
    private dlService: DownloadService,
    private modelService: Isa88ModelService,
    private vdi3682ModelService: Vdi3682ModelService, 
    private loadingScreenService: DataLoaderService
    ) { }
  // util variables
  keys = Object.keys;
  TableUtil = new Tables();
  currentTable: Array<Object> = [];
  tableTitle: string;
  tableSubTitle: string;

  //user input variables
  insertString: string;
  optionMode: string;
  selectedOption: any;


  // variables for behavior 
  isa88 = new ISA88Insert();
  selectOption: Array<string> = [];
  insertreturn: any;

  ngOnInit() {
    this.currentTable = this.modelService.getISA88BehaviorInfo();
    this.selectOption = this.vdi3682ModelService.getLIST_OF_TECHNICAL_RESOURCES();
    this.setTableDescription();

  }

  buildInsert() {
    var variables = this.getVariables();
    this.insertString = this.modelService.buildStateMachine(variables);
    const blob = new Blob([this.insertString], { type: 'text/plain' });
    // Dateiname
    const name = 'insert.txt';
    this.dlService.download(blob, name);
  }

  executeInsert() {
    var variables = this.getVariables();
    this.modelService.insertStateMachine(variables).pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.insertreturn = data
      this.refreshISA88();
    });
    
  }


  getVariables() {
    var varia: ISA88Variables = {
      SystemName: this.selectedOption,
      mode: this.optionMode
    }
    return varia
  }

  setTableDescription(){
    this.tableTitle = "Available state machine entities in database";
    this.tableSubTitle = undefined;
  }

  refreshISA88(){
    this.modelService.loadISA88BehaviorInfo().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.currentTable = data
      this.modelService.setISA88BehaviorInfo(data)
    });
  }

}
