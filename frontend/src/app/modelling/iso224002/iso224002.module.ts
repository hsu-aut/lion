import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Iso224002RoutingModule } from './iso224002-routing.module';
import { Iso224002Component } from './iso224002.component';
import { NewSimpleElementComponent } from './new-simple-element/new-simple-element.component';
import { NewKpiComponent } from './new-kpi/new-kpi.component';
import { ExistingDataComponent } from './existing-data/existing-data.component';
import { HelperModalComponent } from './helper-modal/helper-modal.component';
import { StatsTableModule } from '../../shared/modules/stats-table/stats-table.module';
import { TableModule } from '../../shared/modules/table/table.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    Iso224002Component,
    NewSimpleElementComponent,
    NewKpiComponent,
    ExistingDataComponent,
    HelperModalComponent,
  ],
  imports: [
    CommonModule,
    Iso224002RoutingModule,
    StatsTableModule,
    TableModule,
    ReactiveFormsModule
  ]
})
export class Iso224002Module { }
