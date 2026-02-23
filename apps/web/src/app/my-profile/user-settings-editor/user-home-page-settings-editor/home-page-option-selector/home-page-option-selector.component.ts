import {Component, forwardRef, input} from '@angular/core';
import {HomePageOption, NOOP, VoidFunc} from '@melluin/common';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'app-home-page-option-selector',
    templateUrl: './home-page-option-selector.component.html',
    styleUrls: ['./home-page-option-selector.component.scss'],
    imports: [
        MatCardHeader,
        MatCard,
        MatCardSubtitle,
        MatCardContent,
        MatRadioGroup,
        FormsModule,
        MatRadioButton,
        TranslatePipe
    ],
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
