import {Component, forwardRef, input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NOOP, VoidFunc} from '@shared/util/util';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';

@Component({
    selector: 'app-activity-select',
    templateUrl: './activity-select.component.html',
    styleUrls: ['./activity-select.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ActivitySelectComponent),
        multi: true
    }]
})
export class ActivitySelectComponent implements ControlValueAccessor {

    public readonly label = input.required<string>();
    public readonly options = input.required<Array<VisitActivityType>>();

    private onChange: (x: Array<VisitActivityType>) => void = NOOP;
    private onTouch: VoidFunc = NOOP;
    protected activityTypes: Array<VisitActivityType>

    public writeValue(value: Array<VisitActivityType>): void {
        this.activityTypes = value;
    }

    public registerOnChange(fn: (x: Array<VisitActivityType>) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: VoidFunc): void {
        this.onTouch = fn;
    }

    protected removeType(removedType: VisitActivityType): void {
        this.typesChanged(
            this.activityTypes.filter((type: VisitActivityType) => type !== removedType)
        );
    }

    protected typesChanged(newTypes: Array<VisitActivityType>): void {
        this.activityTypes = newTypes;
        this.onChange(this.activityTypes);
    }

}
