import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ModellingContainerComponent } from './modelling-container.component';
import { ModellingContainerRoutingModule } from './modelling-container-routing.module'
import { FormsModule } from '@angular/forms';

// rdf model components
import { DashboardComponent } from './modelling-components/dashboard/dashboard.component';
import { VDI3682Component } from './modelling-components/vdi3682/vdi3682.component';
import { Dinen61360Component } from './modelling-components/dinen61360/dinen61360.component';
import { Vdi2206Component } from './modelling-components/vdi2206/vdi2206.component';
import { WadlComponent } from './modelling-components/wadl/wadl.component';
import { Isa88Component } from './modelling-components/isa88/isa88.component';
import { ConfigurationsComponent } from './modelling-components/configurations/configurations.component';



// util components
import { TableComponent } from '../../tables/table/table.component';
import { ChartsModule as Ng2Charts } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    ModellingContainerRoutingModule,
    FormsModule,
    Ng2Charts,
    NgbCarouselModule, 
    NgbAlertModule
  ],
  declarations: [
    ModellingContainerComponent,
    // rdf model components
    DashboardComponent,
    VDI3682Component,
    Dinen61360Component,
    Vdi2206Component,
    WadlComponent,
    Isa88Component,
    ConfigurationsComponent,
    
    // util components
    TableComponent
    
  
  ]
})
export class ModellingContainerModule { }
