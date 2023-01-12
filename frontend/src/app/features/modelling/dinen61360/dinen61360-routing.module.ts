import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dinen61360Component } from './dinen61360.component';

const routes: Routes = [ 
  { 
    path: '', 
    component: Dinen61360Component,
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Dinen61360RoutingModule { }