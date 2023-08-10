import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Vdi2206Component } from './vdi2206.component';

const routes: Routes = [
    {
        path: '',
        component: Vdi2206Component,
        children: []
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Vdi2206RoutingModule {}
