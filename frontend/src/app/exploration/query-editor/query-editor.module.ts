import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from '../../shared/modules/table/table.module';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { QueryEditorComponent } from './query-editor.component';
import { QueryEditorRoutingModule } from './query-editor-routing.module';

@NgModule({
    imports: [
        CommonModule,        
        FormsModule,
        ReactiveFormsModule,
        QueryEditorRoutingModule,
        TableModule,
        Ng2Charts,
    ],
    declarations: [QueryEditorComponent]
})
export class QueryEditorModule { }