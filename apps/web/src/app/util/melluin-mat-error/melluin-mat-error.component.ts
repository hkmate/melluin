import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FieldTree} from '@angular/forms/signals';

@Component({
    selector: 'mat-error',
    templateUrl: './melluin-mat-error.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MelluinMatErrorComponent {

    public fField = input.required<FieldTree<unknown>>();

}
