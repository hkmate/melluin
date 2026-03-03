import {Component, input} from '@angular/core';
import {FieldTree} from '@angular/forms/signals';

@Component({
    selector: 'mat-error',
    templateUrl: './melluin-mat-error.component.html',
})
export class MelluinMatErrorComponent {

    public fField = input.required<FieldTree<unknown>>();

}
