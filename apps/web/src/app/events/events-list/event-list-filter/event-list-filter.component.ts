import {Component, effect, inject, signal} from '@angular/core';
import {Department, isNil, VisitStatus, VisitStatuses} from '@melluin/common';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {EventsListPreferences} from '../service/events-list-preferences';
import {EventsFilter} from '../service/events-filter';
import {EventsSettingsService} from '@fe/app/events/events-list/service/events-settings.service';
import {filter, map, Observable} from 'rxjs';
import {Platform} from '@angular/cdk/platform';
import {reasonIsNotPageData} from '@fe/app/util/list-page-settings-change-reason';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {MatCard, MatCardContent, MatCardSubtitle} from '@angular/material/card';
import {
    MatDatepickerToggle,
    MatDateRangeInput,
    MatDateRangePicker,
    MatEndDate,
    MatStartDate
} from '@angular/material/datepicker';
import {DatePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/input';
import {PersonSelectComponent} from '@fe/app/util/person-select/person-select.component';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatCheckbox} from '@angular/material/checkbox';
import {isEqual} from 'lodash-es';
import {form, FormField} from '@angular/forms/signals';

@Component({
    imports: [
        MatCard,
        MatCardContent,
        MatDateRangeInput,
        MatDatepickerToggle,
        MatStartDate,
        MatEndDate,
        MatDateRangePicker,
        DatePipe,
        TranslatePipe,
        MatSuffix,
        PersonSelectComponent,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatCheckbox,
        MatCardSubtitle,
        FormField
    ],
    selector: 'app-event-list-filter',
    templateUrl: './event-list-filter.component.html',
    styleUrls: ['./event-list-filter.component.scss']
})
export class EventListFilterComponent {

    protected readonly statusOptions: Array<VisitStatus> = Object.values(VisitStatuses);

    private readonly platform = inject(Platform);
    private readonly filterService = inject(EventsSettingsService);
    private readonly departmentService = inject(DepartmentService);

    protected readonly mobileScreen = (this.platform.IOS || this.platform.ANDROID);
    protected readonly departmentOptions = toSignal(this.loadDepartmentOptions(), {initialValue: []});

    private readonly filterModel = signal<EventsFilter>(this.filterService.getFilter(), {equal: isEqual});
    private readonly preferencesModel = signal<EventsListPreferences>(this.filterService.getPreferences(), {equal: isEqual});
    protected readonly filterForm = form(this.filterModel);
    protected readonly preferencesForm = form(this.preferencesModel);

    constructor() {
        this.filterService.onChange().pipe(takeUntilDestroyed(), filter(reasonIsNotPageData)).subscribe(() => {
            this.resetSettings()
        });
        effect(() => this.setFilterToService());
        effect(() => this.filterService.setPreferences(this.preferencesModel()));
    }

    private setFilterToService(): void {
        const newFilter = this.filterModel();
        if (isNil(newFilter.dateFrom) || isNil(newFilter.dateTo)) {
            return;
        }
        this.filterService.setFilter(newFilter);
    }

    private resetSettings(): void {
        this.filterModel.set(this.filterService.getFilter());
        this.preferencesModel.set(this.filterService.getPreferences());
    }

    private loadDepartmentOptions(): Observable<Array<Department>> {
        return this.departmentService.findDepartments({page: 1, size: 100})
            .pipe(map(pages => pages.items));
    }

}
