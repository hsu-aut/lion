import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ExplorationComponent } from './exploration.component';

import { ExplorationRoutingModule } from './exploration-routing.module';

// imported children
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QueryEditorComponent } from './query-editor/query-editor.component';
import { AboxExplorerComponent } from './abox-explorer/abox-explorer.component';

// util modules
import { TableModule } from '../shared/modules/table/table.module';
import { ChartsModule as Ng2Charts } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    ExplorationRoutingModule,
    NgbCarouselModule,
    NgbAlertModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    Ng2Charts
  ],
  declarations: [
    ExplorationComponent,
    SidebarComponent,
    QueryEditorComponent,
    DashboardComponent,
    AboxExplorerComponent
  ]
})
export class ExplorationModule { }
