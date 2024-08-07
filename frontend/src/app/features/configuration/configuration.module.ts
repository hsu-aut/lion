import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfigurationComponent } from './configuration.component';

import { ConfigurationRoutingModule } from './configuration-routing.module';

// child components
import { SidebarComponent } from './sidebar/sidebar.component';
import { NamespacesComponent } from './namespaces/namespaces.component';

// util modules
import { TableModule } from '../../shared/modules/table/table.module';

@NgModule({
    imports: [
        CommonModule,
        ConfigurationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule
    ],
    declarations: [
        ConfigurationComponent,
        SidebarComponent,
        NamespacesComponent
    ]
})
export class ConfigurationModule { }
