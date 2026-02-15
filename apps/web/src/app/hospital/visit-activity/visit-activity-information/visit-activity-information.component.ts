import {Component, computed, input} from '@angular/core';
import {HospitalVisitActivityInfo, isNilOrEmpty} from '@melluin/common';

@Component({
    selector: 'app-visit-activity-information',
    templateUrl: './visit-activity-information.component.html'
})
export class VisitActivityInformationComponent {

    public info = input<HospitalVisitActivityInfo>();

    protected empty = computed(() => isNilOrEmpty(this.info()?.content));

}
