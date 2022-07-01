import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseResourceComponent } from './base-resource/base-resource.component';
import { RequestComponent } from './request/request.component';
import { ResponseComponent } from './response/response.component';
import { ServiceComponent } from './service/service.component';
import { WadlComponent } from './wadl.component';

const routes: Routes = [
    {
        path: '',
        component: WadlComponent,
        children: [
            {path: "base-resources", component: BaseResourceComponent},
            {path: "services", component: ServiceComponent},
            {path: "requests", component: RequestComponent},
            {path: "responses", component: ResponseComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WadlRoutingModule {}
