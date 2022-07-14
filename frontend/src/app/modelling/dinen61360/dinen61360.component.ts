import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Dinen61360Service } from '../rdf-models/dinen61360Model.service';

@Component({
  selector: 'app-dinen61360',
  templateUrl: './dinen61360.component.html',
  styleUrls: ['./dinen61360.component.scss']
})

export class Dinen61360Component implements OnInit {

  // variable for stats table content
  public statsTableInput: Array<{name: string, number: number}> = [];

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
    // fork join to write data once ALL 3 observables completed
    forkJoin([
      this.dinen61360Service.getListOfAllDE(), 
        this.dinen61360Service.getListOfAllDET(), 
        this.dinen61360Service.getListOfAllDEI()
      ]).subscribe((data:[string[], string[], string[]]) => {
        this.statsTableInput = [
          {name:"No# Data Elements", number: data[0].length},
          {name:"No# Type Descriptions", number: data[1].length},
          {name:"No# Instance Descriptions", number: data[2].length}
        ]
      })
  }

}
