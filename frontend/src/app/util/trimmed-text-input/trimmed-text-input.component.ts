import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {isNotNil} from '@shared/util/util';

@Component({
    selector: 'app-trimmed-text-input',
    templateUrl: './trimmed-text-input.component.html',
    styleUrls: ['./trimmed-text-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TrimmedTextInputComponent),
            multi: true
        }
    ]
})
export class TrimmedTextInputComponent implements ControlValueAccessor {

    @Input()
    placeholder: string;

    @Input()
    label: string;

    @Input()
    type: string;

    @Input()
    autocomplete: AutoFill;

    protected value: string;
    private onChange: (value: string) => void;
    private onTouched: () => void;

    public registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public writeValue(obj: string): void {
        this.value = obj;
    }

    protected valueChanged(newValue: string): void {
        this.value = newValue;
        this.onChange(this.value);
    }

    protected focusLost(): void {
        if (isNotNil(this.value)) {
            this.value = this.value.trim();
        }
        this.onChange(this.value);
    }

}
