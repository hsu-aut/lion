import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { OdpManagementComponent } from "./odp-management/odp-management.component";
import { RepositoryManagementComponent } from "./repository-management/repository-management.component";
import { RepositoryComponent } from "./repository.component";



const routes: Routes = [
    {
        path: '',
        component: RepositoryComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        RepositoryComponent,
        RepositoryManagementComponent,
        OdpManagementComponent
    ]
})
export class RepositoryModule { }
