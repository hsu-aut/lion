import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout.component';

import { MainLayoutRoutingModule } from './main-layout-routing.module';

// child components
import { HeaderComponent } from './head-nav/header.component';

@NgModule({
  imports: [
    CommonModule,
    MainLayoutRoutingModule
  ],
  declarations: [
    MainLayoutComponent,
    HeaderComponent
  ]
})
export class MainLayoutModule { }
