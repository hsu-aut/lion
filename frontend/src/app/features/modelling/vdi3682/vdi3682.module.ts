import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "../../../shared/modules/table/table.module";
import { Vdi3682ConnectionComponent } from "./connect-existing/vdi3682-connection.component";
import { NewVdi3682IndividualComponent } from "./create-new/new-vdi3682-individual.component";
import { Vdi3682RoutingModule } from "./vdi3682-routing.module";
import { Vdi3682Component } from "./vdi3682.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        Vdi3682RoutingModule,
        TableModule,
    ],
    declarations: [
        Vdi3682Component,
        NewVdi3682IndividualComponent,
        Vdi3682ConnectionComponent
    ]
})
export class Vdi3682Module { }
