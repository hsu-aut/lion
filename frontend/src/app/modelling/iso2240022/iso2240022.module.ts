import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Iso2240022RoutingModule } from './iso2240022-routing.module';
import { Iso2240022Component } from './iso2240022.component';
import { NewSimpleElementComponent } from './new-simple-element/new-simple-element.component';
import { NewKpiComponent } from './new-kpi/new-kpi.component';
import { ExistingDataComponent } from './existing-data/existing-data.component';
import { HelperModalComponent } from './helper-modal/helper-modal.component';
import { StatsTableModule } from '../../shared/modules/stats-table/stats-table.module';
import { TableModule } from '../../shared/modules/table/table.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    Iso2240022Component,
    NewSimpleElementComponent,
    NewKpiComponent,
    ExistingDataComponent,
    HelperModalComponent,
  ],
  imports: [
    CommonModule,
    Iso2240022RoutingModule,
    StatsTableModule,
    TableModule,
    ReactiveFormsModule
  ]
})
export class Iso2240022Module { }
