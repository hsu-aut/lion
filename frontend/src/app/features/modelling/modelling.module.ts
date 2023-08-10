import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { ModellingComponent } from './modelling.component';

import { ModellingRoutingModule } from './modelling-routing.module';

//  child imports
import { SidebarComponent } from './sidebar/sidebar.component';
import { Vdi2206Component } from './vdi2206/vdi2206.component';
import { TableModule } from '../../shared/modules/table/table.module';

// util components


@NgModule({
    imports: [
        CommonModule,
        ModellingRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule
    ],
    declarations: [
        ModellingComponent,
        SidebarComponent,
    ]
})
export class ModellingModule { }
