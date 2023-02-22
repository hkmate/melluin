import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject, Subscription} from 'rxjs';

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
        this.inputChanged.next(this.inputText);
    }

    private initInputSubscription(): void {
        this.inputChangedSubscription = this.inputChanged
            .pipe(
                debounceTime(this.delay),
                distinctUntilChanged()
            )
            .subscribe(() => {
                this.changed.emit(this.inputText)
            });
    }

}
