import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {AutoUnSubscriber} from '@fe/app/util/auto-un-subscriber';

@Component({
    selector: 'app-lazy-input',
    templateUrl: './lazy-input.component.html',
    styleUrl: './lazy-input.component.scss'
})
export class LazyInputComponent extends AutoUnSubscriber implements OnInit {

    private readonly delay = 500;

    @Input()
    public needClearButton = true;

    @Input()
    public set value(newValue: string | undefined) {
        this.inputText = newValue ?? '';
    }

    @Input()
    public label: string;

    @Output()
    public valueChange = new EventEmitter<string>();

    protected inputText = '';
    private inputChanged = new Subject<string>();

    public ngOnInit(): void {
        this.initInputSubscription();
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
        this.addSubscription(this.inputChanged.pipe(
                debounceTime(this.delay),
                distinctUntilChanged()
            ),
            () => {
                this.valueChange.emit(this.inputText)
            });
    }

}
