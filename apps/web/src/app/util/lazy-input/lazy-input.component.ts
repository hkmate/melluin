import {Component, input, linkedSignal, output} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

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
    templateUrl: './lazy-input.component.html',
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
