import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModellingContainerComponent } from './modelling-container.component';

// rdf model components
import { DashboardComponent } from './modelling-components/dashboard/dashboard.component';
// import { VDI3682Component } from './modelling-components/vdi3682/vdi3682.component';
// import { Dinen61360Component } from './modelling-components/dinen61360/dinen61360.component';
// import { Vdi2206Component } from './modelling-components/vdi2206/vdi2206.component';
// import { WadlComponent } from './modelling-components/wadl/wadl.component';
// import { Isa88Component } from './modelling-components/isa88/isa88.component';
// import { Iso22400_2Component } from './modelling-components/iso22400-2/iso22400-2.component';
import { ConfigurationsComponent } from './modelling-components/configurations/configurations.component';


const routes: Routes = [
    { path: '', component: ModellingContainerComponent },
    { path: 'dashboard', component: DashboardComponent },
    // { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    // { path: 'vdi3682', component: VDI3682Component },
    // { path: 'dinen61360', component: Dinen61360Component },
    // { path: 'vdi2206', component: Vdi2206Component },
    // { path: 'wadl', component: WadlComponent },
    // { path: 'isa88', component: Isa88Component },
    // { path: 'iso22400-2', component: Iso22400_2Component },
    { path: 'configuration', component: ConfigurationsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModellingContainerRoutingModule {
}   