import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Dinen61360RoutingModule } from './dinen61360-routing.module';
import { Dinen61360Component } from './dinen61360.component';
import { CreateTypeComponent } from './create-type/create-type.component';
import { CreateInstanceComponent } from './create-instance/create-instance.component';
import { HelperModalComponent } from './helper-modal/helper-modal.component';
import { TableModule } from '../../../shared/modules/table/table.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StatsTableModule } from '../../../shared/modules/stats-table/stats-table.module';

@NgModule({
    declarations: [
        Dinen61360Component,
        CreateTypeComponent,
        CreateInstanceComponent,
        HelperModalComponent,
    ],
    imports: [
        CommonModule,
        Dinen61360RoutingModule,
        TableModule,
        ReactiveFormsModule,
        StatsTableModule
    ]
})
export class Dinen61360Module { }
