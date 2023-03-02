import {Component, Input, OnInit} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';

@Component({
    selector: 'app-visit-related-activities',
    templateUrl: './visit-related-activities.component.html',
    styleUrls: ['./visit-related-activities.component.scss']
})
export class VisitRelatedActivitiesComponent implements OnInit {

    @Input()
    public visit: HospitalVisit;

    protected activities: Array<WrappedHospitalVisitActivity>;

    constructor(private readonly activityService: VisitActivityService) {
    }

    public ngOnInit(): void {
        this.activityService.getRelatedActivities(this.visit.id).subscribe(wrappedActivities => {
            this.activities = wrappedActivities;
        })
    }

}
