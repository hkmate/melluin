import {Component, computed, input} from '@angular/core';
import {VisitActivityInfo, isNilOrEmpty} from '@melluin/common';
import {TranslatePipe} from '@ngx-translate/core';
import {MatCard, MatCardContent} from '@angular/material/card';

@Component({
    selector: 'app-visit-activity-information',
    imports: [
        TranslatePipe,
        MatCard,
        MatCardContent
    ],
    templateUrl: './visit-activity-information.component.html'
})
export class VisitActivityInformationComponent {

    public info = input<VisitActivityInfo>();

    protected empty = computed(() => isNilOrEmpty(this.info()?.content));

}
