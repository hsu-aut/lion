import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenericOdpComponent } from './generic-odp.component';

const routes: Routes = [
    {
        path: '',
        component: GenericOdpComponent,
        children: []
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenericOdpRoutingModule {}
