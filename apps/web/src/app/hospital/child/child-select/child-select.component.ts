import {ChangeDetectionStrategy, Component, input, model, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {isNotEmpty, VisitedChild} from '@melluin/common';
import {MatError, MatFormField, MatLabel} from '@angular/material/input';
import {MatChipListbox, MatChipRemove, MatChipRow} from '@angular/material/chips';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatIcon} from '@angular/material/icon';
import {ChildAgePipe} from '@fe/app/hospital/child/child-age/child-age.pipe';
import {FormValueControl, ValidationError} from '@angular/forms/signals';
import {difference} from 'lodash-es';

@Component({
    imports: [
        MatFormField,
        MatLabel,
        MatChipListbox,
        MatChipRow,
        MatChipRemove,
        MatSelect,
        FormsModule,
        MatIcon,
        MatOption,
        ChildAgePipe,
        MatError
    ],
    selector: 'app-child-select',
    templateUrl: './child-select.component.html',
    styleUrls: ['./child-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildSelectComponent implements FormValueControl<Array<VisitedChild>> {

    public readonly value = model<Array<VisitedChild>>([]);
    public readonly invalid = input<boolean>(false);
    public readonly touched = input<boolean>(false);
    public readonly required = input<boolean>(false);
    public readonly errors = input<ReadonlyArray<ValidationError>>([]);

    public readonly label = input.required<string>();
    public readonly options = input.required<Array<VisitedChild>>();
    public readonly date = input<Date>();

    public readonly childrenUnselected = output<Array<VisitedChild>>();
    public readonly childrenSelected = output<Array<VisitedChild>>();

    protected readonly children = signal<Array<VisitedChild>>([]);

    protected removeChild(visitedChild: VisitedChild): void {
        this.childrenChanged(
            this.children().filter((childInfo: VisitedChild) => childInfo.id !== visitedChild.id)
        );
    }

    protected childrenChanged(newChildren: Array<VisitedChild>): void {
        const removed = difference(this.children(), newChildren);
        const newItems = difference(newChildren, this.children());
        this.children.set(newChildren);
        this.value.set(this.children());
        if (isNotEmpty(newItems)) {
            this.childrenSelected.emit(newItems);
        }
        if (isNotEmpty(removed)) {
            this.childrenUnselected.emit(removed);
        }
    }

}
