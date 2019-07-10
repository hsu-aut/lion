import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { RdfModellingRoutingModule } from './rdf-modelling-routing.module';
import { RdfModellingComponent } from './rdf-modelling.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { LoaderComponent } from '../../shared/loader/loader.component'
import { MessagesComponent } from '../../shared/messages/messages.component'



@NgModule({
  imports: [
    CommonModule,
    NgbCarouselModule,
    NgbAlertModule,
    RdfModellingRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    RdfModellingComponent, 
    SidebarComponent,
    LoaderComponent,
    MessagesComponent
  ]
    
})
export class RdfModellingModule { }
 