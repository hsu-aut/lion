import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MappingComponent } from './mapping.component';

import { MappingRoutingModule } from './mapping-routing.module';

// child components
import { SidebarComponent } from './sidebar/sidebar.component';
import { OpcComponent } from './opc/opc.component';
import { R2rmlComponent } from './r2rml/r2rml.component';

@NgModule({
  imports: [
    CommonModule,
    MappingRoutingModule
  ],
  declarations: [
    MappingComponent,
    SidebarComponent,
    OpcComponent,
    R2rmlComponent
  ]
})
export class MappingModule { }
