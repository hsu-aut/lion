import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "../../shared/modules/table/table.module";
import { WadlBaseResourceComponent } from "./new-base-resource/new-base-resource.component";
import { WadlRoutingModule } from "./wadl-routing.module";
import { WadlComponent } from "./wadl.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        WadlRoutingModule,
        TableModule
    ],
    declarations: [
        WadlComponent,
        WadlBaseResourceComponent,
    ]
})
export class WadlModule { }
