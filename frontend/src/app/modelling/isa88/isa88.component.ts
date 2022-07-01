import { Component, OnInit } from '@angular/core';
import { Isa88ModelService } from '../rdf-models/isa88Model.service';

@Component({
  selector: 'isa88',
  templateUrl: './isa88.component.html',
  styleUrls: ['./isa88.component.scss']
})
export class Isa88Component implements OnInit {

  constructor(
    private modelService: Isa88ModelService,
  ) { }

  ngOnInit(): void {
    this.updateTableContent();
    this.setTableDescription();
  }

  // util variables
  currentTable: Array<Record<string, any>> = [];
  tableTitle: string;
  tableSubTitle: string;

  setTableDescription(): void {
    this.tableTitle = "Available state machine entities in database";
    this.tableSubTitle = undefined;
  }

  updateTableContent(): void {
    this.modelService.getISA88BehaviorInfoTable().subscribe((data: Record<string, string>[]) => this.currentTable = data);
  }

}
