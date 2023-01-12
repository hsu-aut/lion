import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Vdi3682Component } from './vdi3682.component';

const routes: Routes = [
    {
        path: '',
        component: Vdi3682Component,
        children: []
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Vdi3682RoutingModule {}
