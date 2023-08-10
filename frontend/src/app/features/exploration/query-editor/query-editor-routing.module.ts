import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueryEditorComponent } from './query-editor.component';

const routes: Routes = [
    {
        path: '',
        component: QueryEditorComponent,
        children: []
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QueryEditorRoutingModule {}
