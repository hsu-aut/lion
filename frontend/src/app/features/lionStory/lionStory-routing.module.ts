import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LionStoryComponent } from './lionStory.component';

import { AboutComponent } from './about/about.component';
import { ModellingGuideComponent } from './modellingGuide/modellingGuide.component';

const routes: Routes = [
    {
        path: '',
        component: LionStoryComponent,
        children: [
            { path: '', redirectTo: 'about', pathMatch: 'prefix' },
            { path: 'about', component: AboutComponent },
            { path: 'modellingGuide', component: ModellingGuideComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LionStoryRoutingModule {}
