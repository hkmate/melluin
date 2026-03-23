import {ChangeDetectionStrategy, Component, effect, input, model, signal} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatError, MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {form, FormField, FormValueControl, required, ValidationError} from '@angular/forms/signals';

@Component({
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        MatIcon,
        MatIconButton,
        MatSuffix,
        FormField,
        MatError
    ],
    selector: 'app-lazy-input',
    templateUrl: './lazy-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyInputComponent implements FormValueControl<string> {

    private readonly delay = 500;

    public readonly value = model<string>('');
    public readonly required = input<boolean>(false);
    public readonly invalid = input<boolean>(false);
    public readonly touched = model<boolean>(false);
    public readonly errors = input<ReadonlyArray<ValidationError>>([]);

    public readonly label = input.required<string>();
    public readonly needClearButton = input(true);

    protected readonly innerForm = form(signal({innerValue: ''}), schema => {
        required(schema.innerValue, {when: () => this.required()})
    });

    private readonly inputChanged = new Subject<string>();

    constructor() {
        effect(() => this.touched.set(this.innerForm().touched()));
        effect(() => this.innerForm.innerValue().value.set(this.value()));
        effect(() => this.inputChanged.next(this.innerForm().value().innerValue));
        this.inputChanged.pipe(
            takeUntilDestroyed(),
            debounceTime(this.delay),
            distinctUntilChanged()
        ).subscribe(() => this.value.set(this.innerForm.innerValue().value()));
    }

    protected clear(): void {
        this.innerForm.innerValue().value.set('');
    }

}
