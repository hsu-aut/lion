import { Component, Input, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-stats-table',
  templateUrl: './stats-table.component.html',
  styleUrls: ['./stats-table.component.scss']
})

export class StatsTableComponent implements OnInit {
  @Input() statsInput: Array<{name: string, arrayObservable: Observable<Array<any>>}>;
  @Input() headerInput: string;

  public header: string;
  public stats: Array<{ name:string, number:number }>;

  constructor(){}

  ngOnInit(): void {
    this.header = this.headerInput;
    this.getDataFromObservables();
  }

  /**
   * updates table contents whenever inputs are changed 
   */
  ngOnChanges(): void {
    this.getDataFromObservables();
  }

  /**
   * get data from input observable and write data to table once all observables complete
   */
  getDataFromObservables(): void {
    // map array of statistics to array of observables and array of names
    const observableArray: Array<Observable<Array<any>>> = this.statsInput.map(
      (statistic: {name: string, arrayObservable: Observable<Array<any>>}) => statistic.arrayObservable
    );
    const namesArray: Array<string> = this.statsInput.map(
      (statistic: {name: string, arrayObservable: Observable<Array<any>>}) => statistic.name
    );
    // number of statistics
    const nStats: number = observableArray.length;
    // fork join to write data once all observables completed
    forkJoin(observableArray).subscribe((combinedObservableData: Array<Array<any>>) => {
      // reset
      this.stats = [];
      // for each satistic
      combinedObservableData.forEach(
        (observableData: Array<any>, index: number) => {
          this.stats.push({
            name: namesArray[index],
            number: observableData.length  
          });
        }
      )
    });
  }
  
}
