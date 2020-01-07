import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MappingComponent } from './mapping.component';

import { MappingRoutingModule } from './mapping-routing.module';

// child components
import { SidebarComponent } from './sidebar/sidebar.component';
import { OpcComponent } from './opc/opc.component';
import { R2rmlComponent } from './r2rml/r2rml.component';
import { FormsModule } from '@angular/forms';
import { OpcMappingElementComponent } from './opc/subcomponents/opc-mapping-element.component';
import { OpcMappingService } from './opc/opc-mapping.service';

@NgModule({
  imports: [
    CommonModule,
    MappingRoutingModule,
    FormsModule
  ],
  declarations: [
    MappingComponent,
    SidebarComponent,
    OpcComponent,
    OpcMappingElementComponent,
    R2rmlComponent
  ],
  providers: [
      OpcMappingService
  ]
})
export class MappingModule { }
