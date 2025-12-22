import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {StatisticsLayoutComponent} from '@fe/app/statistics/statistics-layout/statistics-layout.component';
import {StatisticsFilterComponent} from '@fe/app/statistics/statistics-filter/statistics-filter.component';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {
    MatDatepickerToggle,
    MatDateRangeInput,
    MatDateRangePicker,
    MatEndDate,
    MatStartDate
} from '@angular/material/datepicker';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
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
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRecycleRows,
    MatRow,
    MatRowDef,
    MatTable
} from '@angular/material/table';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {VisitStatusIconComponent} from '@fe/app/hospital/visit/visit-status-icon/visit-status-icon.component';
import {StatisticsService} from '@fe/app/statistics/service/statistics.service';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {ChildrenByDepartmentsStatProviderService} from '@fe/app/statistics/service/children-by-departments-stat-provider';
import {ChildAgesByDepartmentsStatProviderService} from '@fe/app/statistics/service/child-ages-by-departments-stat-provider';
import {VolunteersByDepartmentsStatProviderService} from '@fe/app/statistics/service/volunteers-by-departments-stat-provider';
import {MatSortModule} from '@angular/material/sort';

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
        MatFormField,
        MatLabel,
        MatOption,
        MatSelect,
        MatCardHeader,
        MatButtonToggleGroup,
        MatButtonToggle,
        MatSortModule,
    ],
    declarations: [
        StatisticsLayoutComponent,
        StatisticsFilterComponent,
        StatisticsWidgetComponent,
        StatisticsWidgetContainerComponent,
        StatisticWidgetTableComponent
    ],
    providers: [
        StatisticsService,
        ChildrenByDepartmentsStatProviderService,
        ChildAgesByDepartmentsStatProviderService,
        VolunteersByDepartmentsStatProviderService
    ]
})
export class StatisticsModule {
}
