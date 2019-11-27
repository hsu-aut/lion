import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModellingComponent } from './modelling.component';

import { ModellingRoutingModule } from './modelling-routing.module';

//  child imports
import { SidebarComponent } from './sidebar/sidebar.component'

@NgModule({
  imports: [
    CommonModule,
    ModellingRoutingModule
  ],
  declarations: [
    ModellingComponent,
    SidebarComponent
  ]
})
export class ModellingModule { }
