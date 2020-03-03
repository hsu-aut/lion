import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MappingComponent } from './mapping.component';

import { MappingRoutingModule } from './mapping-routing.module';

// child components
import { SidebarComponent } from './sidebar/sidebar.component';
import { OpcComponent } from './opc/opc.component';
import { R2rmlComponent } from './r2rml/r2rml.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpcMappingElementComponent } from './opc/subcomponents/opc-mapping-element.component';
import { OpcMappingService } from './opc/opc-mapping.service';

import { StepComponent } from './step/step.component';
import { FpbComponent } from './fpb/fpb.component';
import { FpbStepComponent } from './connectors/fpb-step/fpb-step.component';

// util modules
import { UploadModule } from '../shared/modules/upload/upload.module';


@NgModule({
  imports: [
    CommonModule,
    MappingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UploadModule
  ],
  declarations: [
    MappingComponent,
    SidebarComponent,
    OpcComponent,
    OpcMappingElementComponent,
    R2rmlComponent
  ],
  providers: [
    OpcMappingService,
    R2rmlComponent,
    StepComponent,
    FpbComponent,
    FpbStepComponent
  ]
})
export class MappingModule { }
