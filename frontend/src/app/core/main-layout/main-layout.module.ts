import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';



import { MainLayoutComponent } from './main-layout.component';

import { MainLayoutRoutingModule } from './main-layout-routing.module';

// child components
import { HeaderComponent } from './head-nav/header.component';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { MessagesComponent } from '../../shared/messages/messages.component';

@NgModule({
    imports: [
        CommonModule,
        MainLayoutRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        MainLayoutComponent,
        HeaderComponent,
        LoaderComponent,
        MessagesComponent
    ]
})
export class MainLayoutModule { }
