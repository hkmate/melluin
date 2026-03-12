import {ChangeDetectionStrategy, Component, input, model} from '@angular/core';
import {HomePageOption, HomePageOptions} from '@melluin/common';
import {FormsModule} from '@angular/forms';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {TranslatePipe} from '@ngx-translate/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
    imports: [
        MatCardHeader,
        MatCard,
        MatCardSubtitle,
        MatCardContent,
        MatRadioGroup,
        FormsModule,
        MatRadioButton,
        TranslatePipe,
    ],
    selector: 'app-home-page-option-selector',
    templateUrl: './home-page-option-selector.component.html',
    styleUrls: ['./home-page-option-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageOptionSelectorComponent implements FormValueControl<HomePageOption | null> {

    protected options: Array<HomePageOption> = Object.values(HomePageOptions);

    public readonly value = model<HomePageOption | null>(null);

    public readonly label = input.required<string>();

}
