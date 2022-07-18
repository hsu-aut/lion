import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Iso22400_2ModelService } from '../rdf-models/iso22400_2Model.service';

@Component({
  selector: 'app-iso2240022',
  templateUrl: './iso2240022.component.html',
  styleUrls: ['./iso2240022.component.scss']
})
export class Iso2240022Component implements OnInit {

  // variable for stats table module input
  public statsTable: Array<{name: string, arrayObservable: Observable<Array<string>>}> = [];
  
  // variable for entity name in forms
  public entityName: string;

  // varibale to trigger updates
  public updateBoolean: boolean = false;

  constructor(
    private isoService: Iso22400_2ModelService
  ) { }
   
  ngOnInit(): void {
    this.updateTable();
    this.updateData(); 
  }

  /**
   * method to update entity naem in both forms according to input coming from one of the app tables
   */
  public setEntityName(newEntityName: string): void {
    this.entityName = newEntityName;
  }

  /**
   * update content of stats table
   */
  public updateTable() {
    // trigger update by reassigning
    this.statsTable = [];
    this.statsTable = 
      [
        { name:"No# Elements", arrayObservable: this.isoService.getListOfNonOrganizationalElements() },
        { name:"No# Entitys", arrayObservable: this.isoService.getListOfOrganizationalElements() },
        { name:"No# KPIs", arrayObservable: this.isoService.getListOfKPIs() }
      ];
  }
  
  /**
   * a method to trigger updates in dropdowns and app tables
   */
  public updateData(): void {
    // change boolean to false and back to true to trigger ngOnChanges method of subcomponents
    this.updateBoolean = true; this.updateBoolean = false;
  }
  
}
