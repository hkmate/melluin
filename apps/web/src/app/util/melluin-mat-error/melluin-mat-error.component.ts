import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FieldTree} from '@angular/forms/signals';

/**
 * Warning! When use this helper you have to import MatError (or whole MatFormFieldModule) also.
 */
@Component({
    selector: 'mat-error',
    templateUrl: './melluin-mat-error.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MelluinMatErrorComponent {

    public fField = input.required<FieldTree<unknown>>();

}
