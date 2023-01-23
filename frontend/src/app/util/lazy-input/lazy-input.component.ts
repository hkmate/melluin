import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject, Subscription} from 'rxjs';
import {isNotEmpty} from '@shared/util/util';

@Component({
    selector: 'app-lazy-input',
    templateUrl: './lazy-input.component.html'
})
export class LazyInputComponent implements OnInit, OnDestroy {

    private readonly delay = 500;

    @Input()
    public needClearButton = true;

    @Input()
    public label: string;

    @Output()
    public changed = new EventEmitter<string>();

    protected inputText = '';
    private inputChanged = new Subject<string>();
    private inputChangedSubscription: Subscription;

    public ngOnInit(): void {
        this.initInputSubscription();
    }

    public ngOnDestroy(): void {
        this.inputChangedSubscription.unsubscribe();
    }

    protected handleInputChange(newText: string): void {
        this.inputText = newText;
        this.inputChanged.next(this.inputText);
    }

    protected clear(): void {
        this.inputText = '';
        this.changed.emit(this.inputText);
        this.inputChanged.next(this.inputText);
    }

    private initInputSubscription(): void {
        this.inputChangedSubscription = this.inputChanged
            .pipe(
                debounceTime(this.delay),
                distinctUntilChanged()
            )
            .subscribe(() => {
                // Note: Clear is emitted immediately,
                // lazy change just called to 'distinctUntilChanged' could track the change
                if (isNotEmpty(this.inputText)) {
                    this.changed.emit(this.inputText)
                }
            });
    }

}
