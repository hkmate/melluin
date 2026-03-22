import {Component, forwardRef, input,} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR,} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {isNotNil} from '@melluin/common';


/**
 * @deprecated Will be removed
 */
@Component({
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule
    ],
    selector: 'app-trimmed-text-input',
    template: `
        <mat-form-field>
            <mat-label>{{ label() }}</mat-label>
            <input matInput
                   [attr.type]="type()"
                   [attr.autocomplete]="autocomplete()"
                   [placeholder]="placeholder()"
                   [ngModel]="value"
                   (ngModelChange)="valueChanged($event)"
                   [ngModelOptions]="{standalone: true}"
                   (blur)="focusLost()">
        </mat-form-field>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TrimmedTextInputComponent),
            multi: true
        }
    ]
})
export class TrimmedTextInputComponent implements ControlValueAccessor {

    public readonly placeholder = input.required<string>();
    public readonly label = input.required<string>();
    public readonly type = input<string>('text');
    public readonly autocomplete = input<AutoFill>();

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
