import {ChangeDetectionStrategy, Component, input, model} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {VisitActivityType} from '@melluin/common';
import {MatError, MatFormField, MatLabel} from '@angular/material/input';
import {MatChipListbox, MatChipRemove, MatChipRow} from '@angular/material/chips';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIcon} from '@angular/material/icon';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormValueControl, ValidationError} from '@angular/forms/signals';

@Component({
    imports: [
        MatFormField,
        MatLabel,
        MatChipListbox,
        MatChipRow,
        MatChipRemove,
        TranslatePipe,
        MatIcon,
        MatSelect,
        FormsModule,
        MatOption,
        MatError
    ],
    selector: 'app-activity-select',
    templateUrl: './activity-select.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitySelectComponent implements FormValueControl<Array<VisitActivityType>> {

    public readonly value = model<Array<VisitActivityType>>([]);
    public readonly invalid = input<boolean>(false);
    public readonly touched = input<boolean>(false);
    public readonly errors = input<ReadonlyArray<ValidationError>>([]);
    public readonly required = input<boolean>(false);

    public readonly label = input.required<string>();
    public readonly options = input.required<Array<VisitActivityType>>();

    protected removeType(removedType: VisitActivityType): void {
        this.value.update(prev => prev.filter(type => type !== removedType)
        );
    }

}
