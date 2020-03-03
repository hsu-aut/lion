import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MappingComponent } from './mapping.component';

import { MappingRoutingModule } from './mapping-routing.module';

// child components
import { SidebarComponent } from './sidebar/sidebar.component';
import { OpcComponent } from './opc/opc.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpcMappingElementComponent } from './opc/subcomponents/opc-mapping-element.component';
import { OpcMappingService } from './opc/opc-mapping.service';

import { StepComponent } from './step/step.component';
import { FpbComponent } from './fpb/fpb.component';
import { FpbStepComponent } from './connectors/fpb-step/fpb-step.component';

// util modules
import { UploadModule } from '../shared/modules/upload/upload.module';
import { TableModule } from '../shared/modules/table/table.module';


@NgModule({
  imports: [
    CommonModule,
    MappingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UploadModule,
    TableModule
  ],
  declarations: [
    MappingComponent,
    SidebarComponent,
    OpcComponent,
    OpcMappingElementComponent,
    StepComponent,
    FpbComponent,
    FpbStepComponent
  ],
  providers: [
    OpcMappingService
  ]
})
export class MappingModule { }
