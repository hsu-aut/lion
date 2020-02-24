import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MappingComponent } from './mapping.component';

import { OpcComponent } from './opc/opc.component';
import { R2rmlComponent } from './r2rml/r2rml.component';
import { StepComponent } from './step/step.component';
import { FpbComponent } from './fpb/fpb.component';
import { FpbStepComponent } from './connectors/fpb-step/fpb-step.component';

const routes: Routes = [
    {
        path: '',
        component: MappingComponent,
        children: [
            { path: '', redirectTo: 'opc', pathMatch: 'prefix' },
            { path: 'opc', component: OpcComponent },
            { path: 'r2rml', component: R2rmlComponent },
            { path: 'step', component: StepComponent },
            { path: 'fpb', component: FpbComponent },
            { path: 'fpb-step', component: FpbStepComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MappingRoutingModule {}
