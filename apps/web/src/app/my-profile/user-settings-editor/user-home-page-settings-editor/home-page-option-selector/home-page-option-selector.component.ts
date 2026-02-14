import {Component, forwardRef, input} from '@angular/core';
import {HomePageOption} from '@shared/user/user-settings';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NOOP, VoidFunc} from '@shared/util/util';

@Component({
    selector: 'app-home-page-option-selector',
    templateUrl: './home-page-option-selector.component.html',
    styleUrls: ['./home-page-option-selector.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => HomePageOptionSelectorComponent),
        multi: true
    }]
})
export class HomePageOptionSelectorComponent implements ControlValueAccessor {

    public readonly label = input.required<string>();

    protected selected: HomePageOption;
    protected options: Array<HomePageOption> = Object.values(HomePageOption);

    private onChange: (x: HomePageOption) => void = NOOP;
    private onTouch: VoidFunc = NOOP;

    public writeValue(selected: HomePageOption): void {
        this.selected = selected;
    }

    public registerOnChange(fn: (x: HomePageOption) => void): void {
        this.onChange = fn
    }

    public registerOnTouched(fn: VoidFunc): void {
        this.onTouch = fn;
    }

    protected changed(newOption: HomePageOption): void {
        this.selected = newOption;
        this.onChange(this.selected);
    }

}
