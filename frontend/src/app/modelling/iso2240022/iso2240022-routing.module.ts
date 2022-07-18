import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Iso2240022Component } from './iso2240022.component';

const routes: Routes = [ 
  { 
    path: '', 
    component: Iso2240022Component,
  } 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Iso2240022RoutingModule { }
