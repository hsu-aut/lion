import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { ModellingComponent } from './modelling.component';

import { ModellingRoutingModule } from './modelling-routing.module';

//  child imports
import { SidebarComponent } from './sidebar/sidebar.component';
import { Vdi2206Component } from './vdi2206/vdi2206.component';

// util components
import { TableModule } from '../shared/modules/table/table.module';


@NgModule({
    imports: [
        CommonModule,
        ModellingRoutingModule,
        NgbCarouselModule,
        NgbAlertModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule
    ],
    declarations: [
        ModellingComponent,
        SidebarComponent,
        Vdi2206Component,
    ]
})
export class ModellingModule { }
