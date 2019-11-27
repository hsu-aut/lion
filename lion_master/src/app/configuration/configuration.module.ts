import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfigurationComponent } from './configuration.component';

import { ConfigurationRoutingModule } from './configuration-routing.module';

// child components
import { SidebarComponent } from './sidebar/sidebar.component';
import { RepositoryComponent } from './repository/repository.component';
import { NamespacesComponent } from './namespaces/namespaces.component';
import { GraphsComponent } from './graphs/graphs.component';

// util components
import { TableComponent } from '../layout/tables/table/table.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    NgbCarouselModule,
    NgbAlertModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ConfigurationComponent,
    SidebarComponent,
    RepositoryComponent,
    NamespacesComponent,
    GraphsComponent,
    TableComponent
  ]
})
export class ConfigurationModule { }
