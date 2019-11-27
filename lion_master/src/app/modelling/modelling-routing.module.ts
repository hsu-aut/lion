import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModellingComponent } from './modelling.component';



const routes: Routes = [
    {
        path: '',
        component: ModellingComponent,
        children: [
            // { path: '', redirectTo: 'about', pathMatch: 'prefix' },
            // { path: 'about', component: AboutComponent },
            // { path: 'modellingGuide', component: ModellingGuideComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModellingRoutingModule {}