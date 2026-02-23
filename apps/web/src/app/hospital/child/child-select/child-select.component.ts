import {Component, forwardRef, input, output} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NOOP, VisitedChild, VoidFunc} from '@melluin/common';
import * as _ from 'lodash';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatChipListbox, MatChipRow} from '@angular/material/chips';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatIcon} from '@angular/material/icon';
import {ChildAgePipe} from '@fe/app/hospital/child/child-age/child-age.pipe';

@Component({
    selector: 'app-child-select',
    templateUrl: './child-select.component.html',
    styleUrls: ['./child-select.component.scss'],
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
    private onTouch: VoidFunc = NOOP;
    protected children: Array<VisitedChild>

    public writeValue(value: Array<VisitedChild>): void {
        this.children = value;
    }

    public registerOnChange(fn: (x: Array<VisitedChild>) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: VoidFunc): void {
        this.onTouch = fn;
    }

    protected removeChild(visitedChild: VisitedChild): void {
        this.childrenChanged(
            this.children.filter((childInfo: VisitedChild) => childInfo.id !== visitedChild.id)
        );
    }

    protected childrenChanged(newChildren: Array<VisitedChild>): void {
        const removed = _.difference(this.children, newChildren);
        const newItems = _.difference(newChildren, this.children);
        this.children = newChildren;
        this.onChange(this.children);
        this.childrenSelected.emit(newItems);
        this.childrenUnselected.emit(removed);
    }

}
