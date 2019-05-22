import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Isa88Component } from './components/isa88/isa88.component';
import { Dinen61360Component } from './components/dinen61360/dinen61360.component';
import { VDI3682Component } from './components/vdi3682/vdi3682.component';
import { Vdi2206Component } from './components/vdi2206/vdi2206.component';
import { HomeComponent } from './components/home/home.component';
import { ISO22400Component } from './components/iso22400/iso22400.component';
import { BootstrapComponentsComponent } from './components/bootstrap-components/bootstrap-components.component';
import { ConfigurationsComponent } from './components/configurations/configurations.component';
import { WadlComponent } from './components/wadl/wadl.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'isa88', component: Isa88Component },
  { path: 'vdi3682', component: VDI3682Component },
  { path: 'vdi2206', component: Vdi2206Component },
  { path: 'iso22400', component: ISO22400Component },
  { path: 'dinen61360', component: Dinen61360Component },
  { path: 'BScomponents', component: BootstrapComponentsComponent },
  { path: 'configuration', component: ConfigurationsComponent },
  { path: 'wadl', component: WadlComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  getRoutes(){
    return routes;
  }
}
