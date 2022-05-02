import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WadlComponent } from './wadl.component';

const routes: Routes = [
    {
        path: '',
        component: WadlComponent,
        children: []
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WadlRoutingModule {}
