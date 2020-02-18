import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MappingComponent } from './mapping.component';

import { MappingRoutingModule } from './mapping-routing.module';

// child components
import { SidebarComponent } from './sidebar/sidebar.component';
import { OpcComponent } from './opc/opc.component';
import { R2rmlComponent } from './r2rml/r2rml.component';
import { StepComponent } from './step/step.component';
import { FpbComponent } from './fpb/fpb.component';

// util modules
import { UploadModule } from '../shared/modules/upload/upload.module';

@NgModule({
  imports: [
    CommonModule,
    MappingRoutingModule,
    UploadModule
  ],
  declarations: [
    MappingComponent,
    SidebarComponent,
    OpcComponent,
    R2rmlComponent,
    StepComponent,
    FpbComponent
  ]
})
export class MappingModule { }
