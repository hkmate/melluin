import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Observer, Subscription} from 'rxjs';

@Injectable()
export abstract class AutoUnSubscriber implements OnDestroy {

    private subscriptions: Array<Subscription> = [];

    public ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub?.unsubscribe());
        this.subscriptions = [];
    }

    protected addSubscription<T>(obs: Observable<T>, observer: Partial<Observer<T> | ((value: T) => void)>): void {
        this.subscriptions.push(obs.subscribe(observer));
    }

}
