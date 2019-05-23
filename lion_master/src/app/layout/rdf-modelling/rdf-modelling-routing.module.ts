import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RdfModellingComponent } from './rdf-modelling.component';

const routes: Routes = [
    {
    path: '', component: RdfModellingComponent,
    children: [
        { path: 'model', loadChildren: './modelling-container/modelling-container.module#ModellingContainerModule' },
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RdfModellingRoutingModule {
}       

