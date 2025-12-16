import {Component, effect, inject, input, output} from '@angular/core';
import {Platform} from '@angular/cdk/platform';
import {FormControl, FormGroup} from '@angular/forms';
import {TimeInterval} from '@fe/app/statistics/model/time-interval';

@Component({
    selector: 'app-statistics-interval-filter',
    templateUrl: './statistics-interval-filter.component.html',
    styleUrl: './statistics-interval-filter.component.scss'
})
export class StatisticsIntervalFilterComponent {

    private readonly platform = inject(Platform);
    protected readonly mobileScreen = this.platform.IOS || this.platform.ANDROID;

    public readonly timeInterval = input.required<TimeInterval>();
    public readonly timeIntervalSubmitted = output<TimeInterval>();

    protected readonly fromControl = new FormControl(new Date(), {nonNullable: true});
    protected readonly toControl = new FormControl(new Date(), {nonNullable: true});

    protected readonly form = new FormGroup({
        from: this.fromControl,
        to: this.toControl
    })

    constructor() {
        effect(() => {
            this.fromControl.setValue(new Date(this.timeInterval().from), {emitEvent: false});
            this.toControl.setValue(new Date(this.timeInterval().to), {emitEvent: false});
        }, {allowSignalWrites: true});
    }

    protected submitForm(): void {
        this.timeIntervalSubmitted.emit({
            from: this.fromControl.value.toISOString(),
            to: this.toControl.value.toISOString(),
        });
    }


}
