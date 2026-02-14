import {Component, computed, input} from '@angular/core';
import {HospitalVisitActivityInfo} from '@shared/hospital-visit-activity/hospital-visit-activity-info';
import {isNilOrEmpty} from '@shared/util/util';

@Component({
    selector: 'app-visit-activity-information',
    templateUrl: './visit-activity-information.component.html'
})
export class VisitActivityInformationComponent {

    public info = input<HospitalVisitActivityInfo>();

    protected empty = computed(() => isNilOrEmpty(this.info()?.content));

}
