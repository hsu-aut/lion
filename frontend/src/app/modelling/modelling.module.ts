import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { ModellingComponent } from './modelling.component';

import { ModellingRoutingModule } from './modelling-routing.module';

//  child imports
import { SidebarComponent } from './sidebar/sidebar.component';
import { VDI3682Component } from './vdi3682/vdi3682.component';
import { Dinen61360Component } from './dinen61360/dinen61360.component';
import { Vdi2206Component } from './vdi2206/vdi2206.component';
import { WadlComponent } from './wadl/wadl.component';
import { Isa88Component } from './isa88/isa88.component';
import { Iso22400_2Component } from './iso22400-2/iso22400-2.component';

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
        VDI3682Component,
        Dinen61360Component,
        Vdi2206Component,
        WadlComponent,
        Isa88Component,
        Iso22400_2Component
    ]
})
export class ModellingModule { }
