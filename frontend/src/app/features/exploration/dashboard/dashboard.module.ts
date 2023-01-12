import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from '../../../shared/modules/table/table.module';
import { NgChartsModule } from 'ng2-charts';
import { DashboardRoutingModule } from './dashboard-routing.module';
// import { PieChartComponent } from './pie-chart/pie-chart.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DashboardRoutingModule,
        TableModule,
        NgChartsModule,
    ],
    declarations: [
        DashboardComponent,
        // PieChartComponent,
    ]
})
export class DashboardModule { }
