import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Vdi2206RoutingModule } from "./vdi2206.routing.module";
import { Vdi2206Component } from "./vdi2206.component";
import { TableModule } from "../../../shared/modules/table/table.module";
import { Vdi2206NewIndividualsComponent } from "./new-individuals/vdi2206-new-individuals.component";
import { Vdi2206ConnectInheritComponent } from "./connect-inherit/vdi2206-connect-inherit.component";
import { Vdi2206ConnectContainComponent } from "./connect-contain/vdi2206-connect-contain.component";

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
        Vdi2206NewIndividualsComponent,
        Vdi2206ConnectInheritComponent,
        Vdi2206ConnectContainComponent
    ]
})
export class Vdi2206Module { }
