import {Directive, output} from '@angular/core';

/**
 * Handle native submit event's default behaviour. NgSubmit did that before signal forms.
 */
@Directive({
    selector: 'form[appSubmit]',
    host: {
        '(submit)': 'handleSubmit($event)'
    }
})
export class AppSubmit {

    public appSubmit = output<void>();

    protected handleSubmit(event: SubmitEvent): void {
        event.preventDefault();
        this.appSubmit.emit();
    }

}
