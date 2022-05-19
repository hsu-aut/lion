import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExplorationComponent } from './exploration.component';


import { QueryEditorComponent } from './query-editor/query-editor.component';
import { AboxExplorerComponent } from './abox-explorer/abox-explorer.component';
import { QueryEditorModule } from './query-editor/query-editor.module';

const routes: Routes = [
    {
        path: '',
        component: ExplorationComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren:() => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'query', loadChildren:() => import('./query-editor/query-editor.module').then(m=> m.QueryEditorModule)  },
            { path: 'aboxx', component: AboxExplorerComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExplorationRoutingModule {}
