import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MappingComponent } from './mapping.component';

import { OpcComponent } from './opc/opc.component';
import { StepComponent } from './step/step.component';
import { FpbComponent } from './fpb/fpb.component';
import { FpbStepComponent } from './connectors/fpb-step/fpb-step.component';
import { OpcVDI2206ConnectorComponent } from './connectors/opc-vdi2206/opc-vdi2206-connector.component';
import { Opc61360ConnectorComponent } from './connectors/opc-61360/opc-61360-connector.component';

const routes: Routes = [
    {
        path: '',
        component: MappingComponent,
        children: [
            { path: '', redirectTo: 'opc', pathMatch: 'prefix' },
            { path: 'opc', component: OpcComponent },
            { path: 'step', component: StepComponent },
            { path: 'fpb', component: FpbComponent },
            { path: 'fpb-step', component: FpbStepComponent },
            { path: 'opc-vdi2206', component: OpcVDI2206ConnectorComponent },
            { path: 'opc-dinen61360', component: Opc61360ConnectorComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MappingRoutingModule {}
