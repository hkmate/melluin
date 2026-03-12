import {ChangeDetectionStrategy, Component, effect, inject, input, output, signal} from '@angular/core';
import {Platform} from '@angular/cdk/platform';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
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

@Component({
    imports: [
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        TranslatePipe,
        DatePipe,
        ReactiveFormsModule,
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
        MatButton
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

    protected readonly fromControl = new FormControl(new Date(), {nonNullable: true});
    protected readonly toControl = new FormControl(new Date(), {nonNullable: true});
    protected readonly cityControl = new FormControl<OperationCity>(OperationCities.PECS, {nonNullable: true});

    protected readonly form = new FormGroup({
        from: this.fromControl,
        to: this.toControl,
        city: this.cityControl,
    });

    protected readonly filterExpanded = signal(true);

    constructor() {
        effect(() => {
            this.fromControl.setValue(new Date(this.filter().from), {emitEvent: false});
            this.toControl.setValue(new Date(this.filter().to), {emitEvent: false});
            this.cityControl.setValue(this.filter().city, {emitEvent: false});
        });
    }

    protected submitForm(): void {
        this.filterSubmitted.emit({
            from: this.fromControl.value.toISOString(),
            to: this.toControl.value.toISOString(),
            city: this.cityControl.value
        });
        this.filterExpanded.set(false);
    }

}
