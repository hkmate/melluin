import {ChangeDetectionStrategy, Component, effect, inject, input, output, signal} from '@angular/core';
import {Platform} from '@angular/cdk/platform';
import {form, FormField} from '@angular/forms/signals';
import {OperationCities, OperationCity} from '@melluin/common';
import {StatFilter} from '@fe/app/statistics/model/stat-filter';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from '@angular/material/expansion';
import {TranslatePipe} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {
    MatDatepickerToggle,
    MatDateRangeInput,
    MatDateRangePicker,
    MatEndDate,
    MatStartDate
} from '@angular/material/datepicker';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {isEqual} from 'lodash-es';
import dayjs from 'dayjs';
import {AppSubmit} from '@fe/app/util/submit/app-submit';

@Component({
    imports: [
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        TranslatePipe,
        DatePipe,
        MatDateRangeInput,
        MatStartDate,
        MatEndDate,
        MatDatepickerToggle,
        MatDateRangePicker,
        MatSuffix,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatButton,
        AppSubmit,
        FormField
    ],
    selector: 'app-statistics-filter',
    templateUrl: './statistics-filter.component.html',
    styleUrl: './statistics-filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsFilterComponent {

    protected readonly cityOptions = Object.values(OperationCities);

    private readonly platform = inject(Platform);
    protected readonly mobileScreen = this.platform.IOS || this.platform.ANDROID;

    public readonly filter = input.required<StatFilter>();
    public readonly filterSubmitted = output<StatFilter>();

    protected readonly filterExpanded = signal(true);
    private readonly filterModel = signal({
        from: new Date(),
        to: dayjs().subtract(1, 'month').toDate(),
        city: OperationCities.PECS as OperationCity
    }, {equal: isEqual});

    protected readonly form = form(this.filterModel);

    constructor() {
        effect(() => {
            const {from, to, city} = this.filter();
            this.filterModel.set({
                from: new Date(from),
                to: new Date(to),
                city
            });
        });
    }

    protected submitForm(): void {
        const {from, to, city} = this.filterModel();
        this.filterSubmitted.emit({
            city,
            from: from.toISOString(),
            to: to.toISOString(),
        });
        this.filterExpanded.set(false);
    }

}
