import {Component, effect, inject, input, signal} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';

@Component({
    selector: 'app-related-visit-list',
    templateUrl: './related-visit-list.component.html',
    styleUrls: ['./related-visit-list.component.scss']
})
export class RelatedVisitListComponent {

    private readonly activityService = inject(VisitActivityService);

    public readonly visit = input.required<HospitalVisit>();

    protected visits: Array<WrappedHospitalVisitActivity>;
    protected readonly loading = signal(false);

    constructor() {
        effect(() => {
            this.loading.set(true);
            this.activityService.getRelatedActivities(this.visit().id).subscribe({
                next: wrappedActivities => {
                    this.visits = wrappedActivities;
                    this.loading.set(false);
                }, error: () => {
                    this.loading.set(false);
                }
            });
        }, {allowSignalWrites: true});
    }

}
