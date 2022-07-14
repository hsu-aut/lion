import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats-table',
  templateUrl: './stats-table.component.html',
  styleUrls: ['./stats-table.component.scss']
})

export class StatsTableComponent implements OnInit {
  @Input() statsInput: Array<{name: string, number: number}>;
  @Input() headerInput: string;

  public header: string;
  public stats: Array<{ name:string, number:number }>;

  constructor(){}

  ngOnInit(): void {
    this.header = this.headerInput;
    this.stats = this.statsInput;
  }

  /**
   * updates table contents whenever inputs are changed 
   * (in this case the stats coming from parent compoent)
   */
  ngOnChanges(): void {
    this.stats = this.statsInput;
  }
  
}
