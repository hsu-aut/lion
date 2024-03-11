import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';

import { NamespacesComponent } from './namespaces/namespaces.component';

const routes: Routes = [
    {
        path: '',
        component: ConfigurationComponent,
        children: [
            { path: '', redirectTo: 'repository', pathMatch: 'prefix' },
            { path: 'repository', loadChildren:() => import('./repository/repository.module').then(m => m.RepositoryModule)},
            { path: 'namespaces', component: NamespacesComponent },
            { path: 'graphs', loadChildren:() => import('./graphs/graphs.module').then(m => m.GraphsModule) },
            { path: 'account', loadChildren:() => import('./account/account.module').then(m => m.AccountModule)},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfigurationRoutingModule {}
