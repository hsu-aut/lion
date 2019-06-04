import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';



import { RdfModellingRoutingModule } from './rdf-modelling-routing.module';
import { RdfModellingComponent } from './rdf-modelling.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { LoaderComponent } from '../../shared/loader/loader.component'




@NgModule({
  imports: [
    CommonModule,
    NgbCarouselModule,
    NgbAlertModule,
    RdfModellingRoutingModule
  ],
  declarations: [
    RdfModellingComponent, 
    SidebarComponent,
    LoaderComponent
  ]
    
})
export class RdfModellingModule { }
 