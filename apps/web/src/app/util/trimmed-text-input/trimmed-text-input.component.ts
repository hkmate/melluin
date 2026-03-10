import {ChangeDetectionStrategy, Component, effect, forwardRef, input, model, signal} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {form, FormField, FormValueControl, required, validate, ValidationError} from '@angular/forms/signals';
import {isNotNil} from '@melluin/common';


@Component({
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        MatError,
        FormField,
    ],
    selector: 'app-trimmed-text-input',
    templateUrl: './trimmed-text-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrimmedTextInputComponent2 implements FormValueControl<string> {

    public readonly value = model<string>('')

    public readonly required = input<boolean>(false);
    public readonly invalid = input<boolean>(false);
    public readonly touched = model<boolean>(false);
    public readonly errors = input<ReadonlyArray<ValidationError>>([]);

    public readonly placeholder = input.required<string>();
    public readonly label = input.required<string>();
    public readonly type = input<'text' | 'password'>('text');
    public readonly autocomplete = input<AutoFill>();

    protected readonly innerForm = form(signal({innerValue: ''}), schema => {
        required(schema.innerValue, {when: () => this.required()});
        validate(schema.innerValue, () => (this.invalid() ? {kind: 'invalid'} : null));
    });

    constructor() {
        effect(() => this.touched.set(this.innerForm().touched()));
        effect(() => this.innerForm.innerValue().value.set(this.value()));
    }

    protected focusLost(): void {
        this.value.set(this.innerForm().value().innerValue.trim());
    }

}


/**
 * @deprecated Will be removed when every component got refactored to signal based forms
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
