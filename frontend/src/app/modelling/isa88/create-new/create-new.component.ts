import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Vdi3682ModelService } from '../../rdf-models/vdi3682Model.service';
import { Isa88ModelService } from '../../rdf-models/isa88Model.service';

@Component({
  selector: 'create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})
export class CreateNewComponent implements OnInit {
  @Output("onNewIndividual") onNewIndividual = new EventEmitter<void>();

  constructor(
    private modelService: Isa88ModelService,
    private vdi3682ModelService: Vdi3682ModelService,
  ) { }

  //user input variables
  optionMode: string;
  selectedOption: string;

  // options for mode
  optionsMode: Array<string> = ["Production", "Maintenance"];

  // variables for behavior
  selectOption: Array<string> = [];

  ngOnInit(): void {
    this.vdi3682ModelService.getListOfTechnicalResources().subscribe((data: string[]) => {this.selectOption = data; console.log(data);});
  }

  buildInsert() {
    console.log("1");
    // TODO: errors occur, when preselected selectedOption is not changed
    const mode: string  = this.optionMode;
    const SystemName: string  = this.selectedOption;
    this.modelService.buildISA88(SystemName, mode, "build").subscribe();
  }

  executeInsert() {
    console.log("1");

    const mode: string = this.optionMode;
    const SystemName: string = this.selectedOption;
    this.modelService.buildISA88(SystemName, mode, "add").subscribe(()=>{
      // emit event to upper component to trigger table update
      this.onNewIndividual.emit();
    });
  }
  
}
