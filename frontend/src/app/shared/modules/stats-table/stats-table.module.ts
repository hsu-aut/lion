import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsTableComponent } from './stats-table.component';

@NgModule({
  declarations: [
    StatsTableComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StatsTableComponent
  ]
})
export class StatsTableModule { }
