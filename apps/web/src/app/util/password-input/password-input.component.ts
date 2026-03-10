import {ChangeDetectionStrategy, Component, computed, effect, input, model, signal} from '@angular/core';
import {MatError, MatFormField, MatHint, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {disabled, form, FormField, FormValueControl, required, validate, ValidationError} from '@angular/forms/signals';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        MatError,
        FormField,
        MatIconButton,
        MatIcon,
        MatSuffix,
        MatHint
    ],
    selector: 'app-password-input',
    templateUrl: './password-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordInputComponent implements FormValueControl<string> {

    public readonly value = model<string>('')

    public readonly required = input<boolean>(false);
    public readonly disabled = input<boolean>(false);
    public readonly invalid = input<boolean>(false);
    public readonly touched = model<boolean>(false);
    public readonly errors = input<ReadonlyArray<ValidationError>>([]);

    public readonly placeholder = input.required<string>();
    public readonly hint = input<string>();
    public readonly label = input.required<string>();
    public readonly autocomplete = input<AutoFill>('current-password');

    protected readonly passwordType = signal(true);
    protected readonly type = computed(() => (this.passwordType() ? 'password' : 'text'));

    protected readonly innerForm = form(signal({innerValue: ''}), schema => {
        required(schema.innerValue, {when: () => this.required()});
        validate(schema.innerValue, () => (this.invalid() ? {kind: 'invalid'} : null));
        disabled(schema.innerValue, () => this.disabled());
    });

    constructor() {
        effect(() => this.touched.set(this.innerForm().touched()));
        effect(() => this.innerForm.innerValue().value.set(this.value()));
        effect(() => this.value.set(this.innerForm.innerValue().value()));
    }

    protected changeType(): void {
        this.passwordType.update(old => !old);
    }

}
