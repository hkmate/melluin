import {Injectable, Signal, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class LoaderService {

    private loadingValue = signal(false);

    public get loading(): Signal<boolean> {
        return this.loadingValue;
    }

    public startLoader(): void {
        this.loadingValue.set(true);
    }

    public stopLoader(): void {
        this.loadingValue.set(false);
    }

}
