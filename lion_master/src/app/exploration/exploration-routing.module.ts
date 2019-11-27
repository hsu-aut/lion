import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExplorationComponent } from './exploration.component';


import { DashboardComponent } from './dashboard/dashboard.component';
import { QueryEditorComponent } from './query-editor/query-editor.component';
import { AboxExplorerComponent } from './abox-explorer/abox-explorer.component';

const routes: Routes = [
    {
        path: '',
        component: ExplorationComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'query', component: QueryEditorComponent },
            { path: 'aboxx', component: AboxExplorerComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExplorationRoutingModule {}
