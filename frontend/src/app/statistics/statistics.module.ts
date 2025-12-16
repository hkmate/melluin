import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {StatisticsLayoutComponent} from '@fe/app/statistics/statistics-layout/statistics-layout.component';
import {StatisticsIntervalFilterComponent} from '@fe/app/statistics/statistics-interval-filter/statistics-interval-filter.component';
import {MatCard, MatCardContent} from '@angular/material/card';
import {
    MatDatepickerToggle,
    MatDateRangeInput,
    MatDateRangePicker,
    MatEndDate,
    MatStartDate
} from '@angular/material/datepicker';
import {MatSuffix} from '@angular/material/form-field';
import {MatButton, MatMiniFabAnchor} from '@angular/material/button';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from '@angular/material/expansion';
import {HospitalEventsListModule} from '@fe/app/hospital/visit/hospital-events-list/hospital-events-list.module';
import {MatIcon} from '@angular/material/icon';
import {MatPaginator} from '@angular/material/paginator';
import {StatisticsWidgetComponent} from '@fe/app/statistics/statistics-widget/statistics-widget.component';
import {StatisticsWidgetContainerComponent} from '@fe/app/statistics/statistics-widget-container/statistics-widget-container.component';
import {ChartComponent} from '@fe/app/util/chart/chart.component';
import {StatisticWidgetTableComponent} from '@fe/app/statistics/statistics-widget/statistic-widget-table/statistic-widget-table.component';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell, MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRecycleRows, MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {VisitStatusIconComponent} from '@fe/app/hospital/visit/visit-status-icon/visit-status-icon.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,

        TranslateModule,
        MatCard,
        MatCardContent,
        MatDateRangeInput,
        MatDateRangePicker,
        MatDatepickerToggle,
        MatEndDate,
        MatStartDate,
        MatSuffix,
        MatButton,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        HospitalEventsListModule,
        MatIcon,
        MatMiniFabAnchor,
        MatPaginator,
        ChartComponent,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRecycleRows,
        MatRow,
        MatRowDef,
        MatTable,
        PersonNamePipe,
        VisitStatusIconComponent,
        MatHeaderCellDef,

    ],
    declarations: [
        StatisticsLayoutComponent,
        StatisticsIntervalFilterComponent, StatisticsWidgetComponent, StatisticsWidgetContainerComponent, StatisticWidgetTableComponent
    ]
})
export class StatisticsModule {
}
