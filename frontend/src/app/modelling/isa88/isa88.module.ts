import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Isa88Component } from './isa88.component';
import { CreateNewComponent } from './create-new/create-new.component';
import { TableModule } from "../../shared/modules/table/table.module";
import { Isa88RoutingModule } from './isa88-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    Isa88Component,
    CreateNewComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    Isa88RoutingModule,
    FormsModule
  ]
})
export class Isa88Module { }
