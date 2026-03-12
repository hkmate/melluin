import {Component, inject} from '@angular/core';
import {Department, VisitStatus, Pageable, VisitStatuses} from '@melluin/common';
import {DepartmentService} from '@fe/app/hospital/department/department.service';
import {EventsListPreferences} from '../service/events-list-preferences';
import {EventsFilter} from '../service/events-filter';
import {EventsSettingsService} from '@fe/app/events/events-list/service/events-settings.service';
import {filter} from 'rxjs';
import {Platform} from '@angular/cdk/platform';
import {reasonIsNotPageData} from '@fe/app/util/list-page-settings-change-reason';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatCard, MatCardContent, MatCardSubtitle} from '@angular/material/card';
import {
    MatDatepickerToggle,
    MatDateRangeInput,
    MatDateRangePicker,
    MatEndDate,
    MatStartDate
} from '@angular/material/datepicker';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/input';
import {PersonSelectComponent} from '@fe/app/util/person-select/person-select.component';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatCheckbox} from '@angular/material/checkbox';

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
        FormsModule,
        TranslatePipe,
        MatSuffix,
        PersonSelectComponent,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatCheckbox,
        MatCardSubtitle
    ],
    selector: 'app-event-list-filter',
    templateUrl: './event-list-filter.component.html',
    styleUrls: ['./event-list-filter.component.scss']
})
export class EventListFilterComponent {

    private readonly platform = inject(Platform);
    private readonly filterService = inject(EventsSettingsService);
    private readonly departmentService = inject(DepartmentService);

    protected filters: EventsFilter;
    protected preferences: EventsListPreferences;
    protected departmentOptions: Array<Department>;
    protected statusOptions: Array<VisitStatus> = Object.values(VisitStatuses);
    protected mobileScreen: boolean;

    constructor() {
        this.mobileScreen = (this.platform.IOS || this.platform.ANDROID);
        this.filterService.onChange().pipe(takeUntilDestroyed(), filter(reasonIsNotPageData)).subscribe(() => {
            this.resetSettings()
        });
        this.resetSettings();
        this.initDepartmentOptions();
    }

    protected filterSet(): void {
        this.filterService.setFilter(this.filters);
    }

    protected preferenceSet(): void {
        this.filterService.setPreferences(this.preferences);
    }

    private resetSettings(): void {
        this.filters = this.filterService.getFilter();
        this.preferences = this.filterService.getPreferences();
    }

    private initDepartmentOptions(): void {
        this.departmentService.findDepartments({page: 1, size: 100}).subscribe({
            next: (departmentPage: Pageable<Department>) => {
                this.departmentOptions = departmentPage.items;
            }
        });
    }

}
