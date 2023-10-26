import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NOOP, VoidFunc} from '@shared/util/util';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import * as _ from 'lodash';

@Component({
    selector: 'app-child-select',
    templateUrl: './child-select.component.html',
    styleUrls: ['./child-select.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ChildSelectComponent),
        multi: true
    }]
})
export class ChildSelectComponent implements ControlValueAccessor {

    @Input()
    public label: string;

    @Input()
    public options: Array<VisitedChild>;

    @Input()
    public date: Date;

    @Output()
    public childrenUnselected = new EventEmitter<Array<VisitedChild>>();

    @Output()
    public childrenSelected = new EventEmitter<Array<VisitedChild>>();

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
