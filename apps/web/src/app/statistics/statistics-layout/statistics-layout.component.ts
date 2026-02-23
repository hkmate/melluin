import {Component, inject, signal} from '@angular/core';
import dayjs from 'dayjs';
import {OperationCity, Permission} from '@melluin/common';
import {StatFilter} from '@fe/app/statistics/model/stat-filter';
import {UrlParamHandler} from '@fe/app/util/url-param-handler/url-param-handler';
import {AppTitle} from '@fe/app/app-title.service';
import {StatisticsService} from '@fe/app/statistics/service/statistics.service';
import {ChildrenByDepartmentsStatProviderService} from '@fe/app/statistics/service/children-by-departments-stat-provider';
import {ChildAgesByDepartmentsStatProviderService} from '@fe/app/statistics/service/child-ages-by-departments-stat-provider';
import {VolunteersByDepartmentsStatProviderService} from '@fe/app/statistics/service/volunteers-by-departments-stat-provider';
import {VisitCountByWeekDayStatProviderService} from '@fe/app/statistics/service/visit-count-by-week-day-stat-provider';
import {TranslatePipe} from '@ngx-translate/core';
import {StatisticsFilterComponent} from '@fe/app/statistics/statistics-filter/statistics-filter.component';
import {StatisticsWidgetContainerComponent} from '@fe/app/statistics/statistics-widget-container/statistics-widget-container.component';

function getDefaultFilter(): StatFilter {
    const now = dayjs().toISOString();
    const lastMonth = dayjs().subtract(1, 'month').toISOString();
    return {from: lastMonth, to: now, city: OperationCity.PECS} satisfies StatFilter;
}

@Component({
    selector: 'app-statistics-layout',
    templateUrl: './statistics-layout.component.html',
    styleUrl: './statistics-layout.component.scss',
    imports: [
        TranslatePipe,
        StatisticsFilterComponent,
        StatisticsWidgetContainerComponent
    ],
    providers: [
        UrlParamHandler,
        StatisticsService,
        ChildrenByDepartmentsStatProviderService,
        ChildAgesByDepartmentsStatProviderService,
        VolunteersByDepartmentsStatProviderService,
        VisitCountByWeekDayStatProviderService,
    ]
})
export class StatisticsLayoutComponent {

    private readonly title = inject(AppTitle);
    protected readonly Permission = Permission;
    private readonly urlParams = inject(UrlParamHandler);

    protected readonly statFilter = signal<StatFilter>(this.getFilterOnConstruct());
    protected readonly submitted = signal(false)

    constructor() {
        this.title.setTitleByI18n('Titles.Statistics');
    }

    protected setFilter(newValue: StatFilter): void {
        this.statFilter.set(newValue);
        this.submitted.set(true);
        this.saveFilterToUrl(newValue)
    }

    // eslint-disable-next-line max-lines-per-function
    private getFilterOnConstruct(): StatFilter {
        const defaultValues = getDefaultFilter();
        const urlTimeParamsPresented = this.urlParams.hasParam('from') && this.urlParams.hasParam('to')
        if (urlTimeParamsPresented) {
            return {
                from: this.urlParams.getParam('from')!,
                to: this.urlParams.getParam('to')!,
                city: this.urlParams.getParam('city') as OperationCity ?? defaultValues.city
            } satisfies StatFilter
        }

        return {
            ...defaultValues,
            city: this.urlParams.getParam('city') as OperationCity ?? defaultValues.city
        } satisfies StatFilter;
    }

    private saveFilterToUrl({from, to, city}: StatFilter): void {
        this.urlParams.setParams({from, to, city});
    }

}
