import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { GraphsComponent } from './graphs.component';
import { GraphManagementComponent } from './graph-management/graph-management.component';
import { UpAndDownloadsComponent } from './up-and-downloads/up-and-downloads.component';

const routes: Routes = [
    {
        path: '',
        component: GraphsComponent,
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
        GraphsComponent,
        GraphManagementComponent,
        UpAndDownloadsComponent,
        ConfirmationModalComponent
    ]
})
export class GraphsModule { }
