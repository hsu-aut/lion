import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "../../../shared/modules/table/table.module";
import { BaseResourceComponent } from "./base-resource/base-resource.component";
import { OntoHelperModalComponent } from "./helper-modal/onto-helper-modal.component";
import { RequestComponent } from "./request/request.component";
import { ResponseComponent } from "./response/response.component";
import { ResourceComponent } from "./resource/resource.component";
import { WadlRoutingModule } from "./wadl-routing.module";
import { WadlComponent } from "./wadl.component";
import { RepresentationComponent } from "./representation/representation.component";
import { ParameterComponent } from "./parameter/parameter.component";

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
        BaseResourceComponent,
        ResourceComponent,
        RequestComponent,
        ResponseComponent,
        RepresentationComponent,
        ParameterComponent,
        OntoHelperModalComponent
    ]
})
export class WadlModule { }
