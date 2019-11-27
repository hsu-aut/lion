import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';


// import { ModellingGuideComponent } from './modellingGuide/modellingGuide.component';


const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'lionStory', loadChildren: '../lionStory/lionStory.module#LionStoryModule' },
            { path: 'configuration', loadChildren: '../configuration/configuration.module#ConfigurationModule' },
            { path: 'modelling', loadChildren: '../modelling/modelling.module#ModellingModule' },
            { path: 'exploration', loadChildren: '../exploration/exploration.module#ExplorationModule' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainLayoutRoutingModule {}
