import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModellingComponent } from './modelling.component';

// import children
import { VDI3682Component } from './vdi3682/vdi3682.component';
import { Dinen61360Component } from './dinen61360/dinen61360.component';
import { Vdi2206Component } from './vdi2206/vdi2206.component';
import { WadlComponent } from './wadl/wadl.component';
import { Isa88Component } from './isa88/isa88.component';
import { Iso22400_2Component } from './iso22400-2/iso22400-2.component';


const routes: Routes = [
    {
        path: '',
        component: ModellingComponent,
        children: [
            { path: '', redirectTo: 'vdi3682', pathMatch: 'prefix' },
            { path: 'vdi3682', component: VDI3682Component },
            { path: 'dinen61360', component: Dinen61360Component },
            { path: 'vdi2206', component: Vdi2206Component },
            { path: 'wadl', component: WadlComponent },
            { path: 'isa88', component: Isa88Component },
            { path: 'iso22400-2', component: Iso22400_2Component },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModellingRoutingModule {}