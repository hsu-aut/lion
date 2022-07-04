import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Isa88Component } from './isa88.component';

const routes: Routes = [
    {
        path: '',
        component: Isa88Component,
        children: []
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Isa88RoutingModule {}
