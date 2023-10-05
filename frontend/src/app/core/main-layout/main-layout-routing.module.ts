import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
// import { ModellingGuideComponent } from './modellingGuide/modellingGuide.component';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'lionStory', pathMatch: 'prefix' },
            { path: 'lionStory', loadChildren: () => import('../../features/lionStory/lionStory.module').then(m => m.LionStoryModule)},
            { path: 'configuration',  loadChildren: () => import('../../features/configuration/configuration.module').then(m => m.ConfigurationModule)},
            { path: 'modelling', loadChildren: () => import('../../features/modelling/modelling.module').then(m => m.ModellingModule)},
            { path: 'exploration', loadChildren: () => import('../../features/exploration/exploration.module').then(m => m.ExplorationModule) },
            { path: 'mapping', loadChildren: () => import('../../features/mapping/mapping.module').then(m => m.MappingModule) },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainLayoutRoutingModule {}
