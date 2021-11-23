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

// util modules
import { TableModule } from '../shared/modules/table/table.module';

@NgModule({
    imports: [
        CommonModule,
        ConfigurationRoutingModule,
        NgbCarouselModule,
        NgbAlertModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule
    ],
    declarations: [
        ConfigurationComponent,
        SidebarComponent,
        RepositoryComponent,
        NamespacesComponent,
        GraphsComponent
    ]
})
export class ConfigurationModule { }
