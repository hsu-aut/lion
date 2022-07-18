import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Iso224002Component } from './iso224002.component';

const routes: Routes = [ 
  { 
    path: '', 
    component: Iso224002Component,
  } 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Iso224002RoutingModule { }
