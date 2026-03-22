import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {VisitActivityInfo, isNilOrEmpty} from '@melluin/common';
import {TranslatePipe} from '@ngx-translate/core';
import {MatCard, MatCardContent} from '@angular/material/card';

@Component({
    imports: [
        TranslatePipe,
        MatCard,
        MatCardContent
    ],
    selector: 'app-visit-activity-information',
    templateUrl: './visit-activity-information.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitActivityInformationComponent {

    public readonly info = input<VisitActivityInfo>();

    protected readonly empty = computed(() => isNilOrEmpty(this.info()?.content));

}
