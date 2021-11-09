import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';


// import { ModellingGuideComponent } from './modellingGuide/modellingGuide.component';


const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'lionStory', loadChildren: () => import('../lionStory/lionStory.module').then(m => m.LionStoryModule)},
            { path: 'configuration',  loadChildren: () => import('../configuration/configuration.module').then(m => m.ConfigurationModule)},
            { path: 'modelling', loadChildren: () => import('../modelling/modelling.module').then(m => m.ModellingModule)},
            { path: 'exploration', loadChildren: () => import('../exploration/exploration.module').then(m => m.ExplorationModule) },
            { path: 'mapping', loadChildren: () => import('../mapping/mapping.module').then(m => m.MappingModule) },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainLayoutRoutingModule {}
