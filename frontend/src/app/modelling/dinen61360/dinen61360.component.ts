import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Dinen61360Service } from '../rdf-models/dinen61360Model.service';

@Component({
  selector: 'app-dinen61360',
  templateUrl: './dinen61360.component.html',
  styleUrls: ['./dinen61360.component.scss']
})

export class Dinen61360Component implements OnInit {
 
  // variable for stats table module input
  public statsTable: Array<{name: string, arrayObservable: Observable<Array<string>>}> = [];

  constructor(
    private dinen61360Service: Dinen61360Service,
  ) { }

  ngOnInit(): void {
    this.updateTable(); 
  }

  /**
   * update content of stats table
   */
  public updateTable() {
    // trigger update by reassigning
    this.statsTable = [];
    this.statsTable = 
      [
        { name:"No# Data Elements", arrayObservable: this.dinen61360Service.getListOfAllDE() },
        { name:"No# Type Descriptions", arrayObservable: this.dinen61360Service.getListOfAllDET() },
        { name:"No# Instance Descriptions", arrayObservable: this.dinen61360Service.getListOfAllDEI() }
      ];
  }  

}
