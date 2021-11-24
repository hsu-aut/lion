import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared';


const routes: Routes = [
    // { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
    { path: '', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
    { path: 'main', loadChildren: () => import('./main-layout/main-layout.module').then(m => m.MainLayoutModule)},
    { path: 'error', loadChildren: () => import('./server-error/server-error.module').then(m => m.ServerErrorModule)},
    { path: 'not-found', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule)},
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
