import {Component, effect, inject, input, output} from '@angular/core';
import {Platform} from '@angular/cdk/platform';
import {FormControl, FormGroup} from '@angular/forms';
import {OperationCity} from '@shared/person/operation-city';
import {StatFilter} from '@fe/app/statistics/model/stat-filter';

@Component({
    selector: 'app-statistics-filter',
    templateUrl: './statistics-filter.component.html',
    styleUrl: './statistics-filter.component.scss'
})
export class StatisticsFilterComponent {

    protected readonly cityOptions = Object.values(OperationCity);

    private readonly platform = inject(Platform);
    protected readonly mobileScreen = this.platform.IOS || this.platform.ANDROID;

    public readonly filter = input.required<StatFilter>();
    public readonly filterSubmitted = output<StatFilter>();

    protected readonly fromControl = new FormControl(new Date(), {nonNullable: true});
    protected readonly toControl = new FormControl(new Date(), {nonNullable: true});
    protected readonly cityControl = new FormControl<OperationCity>(OperationCity.PECS, {nonNullable: true});

    protected readonly form = new FormGroup({
        from: this.fromControl,
        to: this.toControl,
        city: this.cityControl,
    })

    constructor() {
        effect(() => {
            this.fromControl.setValue(new Date(this.filter().from), {emitEvent: false});
            this.toControl.setValue(new Date(this.filter().to), {emitEvent: false});
            this.cityControl.setValue(this.filter().city, {emitEvent: false});
        }, {allowSignalWrites: true});
    }

    protected submitForm(): void {
        this.filterSubmitted.emit({
            from: this.fromControl.value.toISOString(),
            to: this.toControl.value.toISOString(),
            city: this.cityControl.value
        });
    }

}
