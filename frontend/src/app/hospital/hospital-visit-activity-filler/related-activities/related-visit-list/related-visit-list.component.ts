import {Component, Input, OnInit} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';

@Component({
    selector: 'app-related-visit-list',
    templateUrl: './related-visit-list.component.html',
    styleUrls: ['./related-visit-list.component.scss']
})
export class RelatedVisitListComponent implements OnInit {

    @Input()
    public visit: HospitalVisit;

    protected visits: Array<WrappedHospitalVisitActivity>;

    constructor(private readonly activityService: VisitActivityService) {
    }

    public ngOnInit(): void {
        this.activityService.getRelatedActivities(this.visit.id).subscribe(wrappedActivities => {
            this.visits = wrappedActivities;
        })
    }

}
