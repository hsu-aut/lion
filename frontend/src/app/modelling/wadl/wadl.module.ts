import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "../../shared/modules/table/table.module";
import { BaseResourceComponent } from "./base-resource/base-resource.component";
import { OntoHelperModalComponent } from "./helper-modal/onto-helper-modal.component";
import { RequestComponent } from "./request/request.component";
import { ResponseComponent } from "./response/response.component";
import { ServiceComponent } from "./service/service.component";
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
        BaseResourceComponent,
        ServiceComponent,
        RequestComponent,
        ResponseComponent,
        OntoHelperModalComponent
    ]
})
export class WadlModule { }
