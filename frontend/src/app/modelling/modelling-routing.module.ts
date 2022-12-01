import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModellingComponent } from './modelling.component';

// import children
import { Vdi2206Component } from './vdi2206/vdi2206.component';


const routes: Routes = [
    {
        path: '',
        component: ModellingComponent,
        children: [
            { path: '', redirectTo: 'vdi3682', pathMatch: 'prefix' },
            { path: 'vdi3682', loadChildren:() => import('./vdi3682/vdi3682.module').then(m => m.Vdi3682Module)},
            { path: 'wadl', loadChildren:() => import('./wadl/wadl.module').then(m => m.WadlModule)},
            { path: 'vdi2206', component: Vdi2206Component },
            { path: 'isa88', loadChildren:() => import('./isa88/isa88.module').then(m => m.Isa88Module)},
            { path: 'dinen61360', loadChildren:() => import('./dinen61360/dinen61360.module').then(m => m.Dinen61360Module)},
            { path: 'iso22400-2', loadChildren:() => import('./iso224002/iso224002.module').then(m => m.Iso224002Module)},
            { path: 'generic-odp', loadChildren:() => import('./generic-odp/generic-odp.module').then(m => m.GenericOdpModule)},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModellingRoutingModule {}
