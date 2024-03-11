import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/auth/auth.guard';
import { AuthModule } from './shared/auth/auth.module';

const routes: Routes = [
    // { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
    { path: '', loadChildren: () => import('./core/login/login.module').then(m => m.LoginModule)},
    { path: 'main', loadChildren: () => import('./core/main-layout/main-layout.module').then(m => m.MainLayoutModule), canActivateChild: [AuthGuard]},
    { path: 'not-found', loadChildren: () => import('./core/not-found/not-found.module').then(m => m.NotFoundModule)},
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        AuthModule
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
