import {Component, effect, input, linkedSignal, model, output, signal} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatError, MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
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
    styleUrl: './lazy-input.component.scss'
})
export class LazyInputComponent2 implements FormValueControl<string> {

    private readonly delay = 500;

    public readonly value = model.required<string>();
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
        effect(() => {
            this.touched.set(this.innerForm().touched());
        });
        effect(() => {
            this.innerForm.innerValue().value.set(this.value());
        });
        effect(() => {
            this.inputChanged.next(this.innerForm().value().innerValue);
        });
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


/**
 * @deprecated Will be removed when every component got refactored to signal based forms
 */
@Component({
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
        MatIcon,
        MatIconButton
    ],
    selector: 'app-lazy-input',
    template: `
        <mat-form-field>
            <mat-label>{{ label() }}</mat-label>
            <input matInput type="text"
                   [ngModel]="inputText()"
                   (ngModelChange)="handleInputChange($event)"
                   [ngModelOptions]="{standalone: true}">
            @if (inputText() && needClearButton()) {
                <button matSuffix mat-icon-button (click)="clear()">
                    <mat-icon>close</mat-icon>
                </button>
            }
        </mat-form-field>
    `,
    styleUrl: './lazy-input.component.scss'
})
export class LazyInputComponent {

    private readonly delay = 500;

    public readonly needClearButton = input(true);
    public readonly value = input<string>();
    public readonly label = input.required<string>();

    public readonly valueChange = output<string>();

    protected readonly inputText = linkedSignal(() => this.value() ?? '');
    private inputChanged = new Subject<string>();

    constructor() {
        this.inputChanged.pipe(
            takeUntilDestroyed(),
            debounceTime(this.delay),
            distinctUntilChanged()
        ).subscribe(() => this.valueChange.emit(this.inputText()));
    }

    protected handleInputChange(newText: string): void {
        this.inputText.set(newText);
        this.inputChanged.next(this.inputText());
    }

    protected clear(): void {
        this.inputText.set('');
        this.inputChanged.next(this.inputText());
    }

}
