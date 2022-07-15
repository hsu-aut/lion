import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ExplorationComponent } from './exploration.component';

import { ExplorationRoutingModule } from './exploration-routing.module';

// imported children
import { SidebarComponent } from './sidebar/sidebar.component';
import { AboxExplorerComponent } from './abox-explorer/abox-explorer.component';

// util modules
import { TableModule } from '../shared/modules/table/table.module';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
    imports: [
        CommonModule,
        ExplorationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        NgChartsModule
    ],
    declarations: [
        ExplorationComponent,
        SidebarComponent,
        AboxExplorerComponent
    ]
})
export class ExplorationModule { }
