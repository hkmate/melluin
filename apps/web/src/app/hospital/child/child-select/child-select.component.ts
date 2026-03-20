import {Component, forwardRef, input, model, output, signal} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NOOP, VisitedChild} from '@melluin/common';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatChipListbox, MatChipRow} from '@angular/material/chips';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatIcon} from '@angular/material/icon';
import {ChildAgePipe} from '@fe/app/hospital/child/child-age/child-age.pipe';
import {FormValueControl} from '@angular/forms/signals';
import {difference} from 'lodash-es';

@Component({
    imports: [
        MatFormField,
        MatLabel,
        MatChipListbox,
        MatChipRow,
        MatSelect,
        FormsModule,
        MatIcon,
        MatOption,
        ChildAgePipe
    ],
    selector: 'app-child-select',
    templateUrl: './child-select.component.html',
    styleUrls: ['./child-select.component.scss']
})
export class ChildSelectComponent2 implements FormValueControl<Array<VisitedChild>> {

    public readonly value = model.required<Array<VisitedChild>>();

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
        this.childrenSelected.emit(newItems);
        this.childrenUnselected.emit(removed);
    }

}

/** @deprecated  **/
@Component({
    imports: [
        MatFormField,
        MatLabel,
        MatChipListbox,
        MatChipRow,
        MatSelect,
        FormsModule,
        MatIcon,
        MatOption,
        ChildAgePipe
    ],
    selector: 'app-child-select',
    template: `
        <mat-form-field class="chip-selector">
            <mat-label>{{ label() }}</mat-label>
            <mat-chip-listbox>
                @for (patientInfo of children; track patientInfo.id) {
                    <mat-chip-row (removed)="removeChild(patientInfo)">
                        {{ patientInfo.child.name }}
                        <button matChipRemove>
                            <mat-icon>cancel</mat-icon>
                        </button>
                    </mat-chip-row>
                }
            </mat-chip-listbox>
            <mat-select [ngModel]="children" (ngModelChange)="childrenChanged($event)" multiple>
                @for (option of options(); track option.id) {
                    <mat-option class="child-select-option" [value]="option">
                <span class="child-info">
                    <span class="name">{{ option.child.name }}</span>
                    @let dateValue = date();
                    @if (dateValue) {
                        <span class="age">({{ option.child | childAge : dateValue }})</span>
                    }
                </span>
                    </mat-option>
                }
            </mat-select>
        </mat-form-field>`,
    styleUrls: ['./child-select.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ChildSelectComponent),
        multi: true
    }]
})
export class ChildSelectComponent implements ControlValueAccessor {

    public readonly label = input.required<string>();
    public readonly options = input.required<Array<VisitedChild>>();
    public readonly date = input<Date>();

    public readonly childrenUnselected = output<Array<VisitedChild>>();
    public readonly childrenSelected = output<Array<VisitedChild>>();

    private onChange: (x: Array<VisitedChild>) => void = NOOP;
    private onTouch: () => void = NOOP;
    protected children: Array<VisitedChild>

    public writeValue(value: Array<VisitedChild>): void {
        this.children = value;
    }

    public registerOnChange(fn: (x: Array<VisitedChild>) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouch = fn;
    }

    protected removeChild(visitedChild: VisitedChild): void {
        this.childrenChanged(
            this.children.filter((childInfo: VisitedChild) => childInfo.id !== visitedChild.id)
        );
    }

    protected childrenChanged(newChildren: Array<VisitedChild>): void {
        const removed = difference(this.children, newChildren);
        const newItems = difference(newChildren, this.children);
        this.children = newChildren;
        this.onChange(this.children);
        this.childrenSelected.emit(newItems);
        this.childrenUnselected.emit(removed);
    }

}
