import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "../../../shared/modules/table/table.module";
import { Vdi2206RoutingModule } from "./vdi2206.routing.module";
import { Vdi2206Component } from "./vdi2206.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        Vdi2206RoutingModule,
        TableModule,
    ],
    declarations: [
        Vdi2206Component,
    ]
})
export class Vdi2206Module { }
