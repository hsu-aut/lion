import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';

import { RepositoryComponent } from './repository/repository.component';
import { NamespacesComponent } from './namespaces/namespaces.component';
import { GraphsComponent } from './graphs/graphs.component';

const routes: Routes = [
    {
        path: '',
        component: ConfigurationComponent,
        children: [
            { path: '', redirectTo: 'repository', pathMatch: 'prefix' },
            { path: 'repository', component: RepositoryComponent },
            { path: 'namespaces', component: NamespacesComponent },
            { path: 'graphs', component: GraphsComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfigurationRoutingModule {}
