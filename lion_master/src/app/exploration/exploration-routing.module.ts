import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExplorationComponent } from './exploration.component';


import { QueryEditorComponent } from './query-editor/query-editor.component';

const routes: Routes = [
    {
        path: '',
        component: ExplorationComponent,
        children: [
            // { path: '', redirectTo: 'about', pathMatch: 'prefix' },
            // { path: 'about', component: AboutComponent },
            { path: 'query', component: QueryEditorComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExplorationRoutingModule {}
