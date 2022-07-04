import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModellingComponent } from './modelling.component';

// import children
import { Dinen61360Component } from './dinen61360/dinen61360.component';
import { Vdi2206Component } from './vdi2206/vdi2206.component';
import { Iso22400_2Component } from './iso22400-2/iso22400-2.component';


const routes: Routes = [
    {
        path: '',
        component: ModellingComponent,
        children: [
            { path: '', redirectTo: 'vdi3682', pathMatch: 'prefix' },
            { path: 'vdi3682', loadChildren:() => import('./vdi3682/vdi3682.module').then(m => m.Vdi3682Module)},
            { path: 'wadl', loadChildren:() => import('./wadl/wadl.module').then(m => m.WadlModule)},
            { path: 'dinen61360', component: Dinen61360Component },
            { path: 'vdi2206', component: Vdi2206Component },
            { path: 'isa88', loadChildren:() => import('./isa88/isa88.module').then(m => m.Isa88Module)},
            { path: 'iso22400-2', component: Iso22400_2Component },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModellingRoutingModule {}
