import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ExplorationComponent } from './exploration.component';

import { ExplorationRoutingModule } from './exploration-routing.module';

// imported children
import { SidebarComponent } from './sidebar/sidebar.component';
import { QueryEditorComponent } from './query-editor/query-editor.component';

@NgModule({
  imports: [
    CommonModule,
    ExplorationRoutingModule,
    NgbCarouselModule,
    NgbAlertModule,
    FormsModule,
    ReactiveFormsModule

  ],
  declarations: [
    ExplorationComponent,
    SidebarComponent,
    QueryEditorComponent
  ]
})
export class ExplorationModule { }
