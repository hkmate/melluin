import {Component, effect, inject, input, signal} from '@angular/core';
import {Visit, WrappedVisitActivity} from '@melluin/common';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {DatePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {RelatedVisitComponent} from '@fe/app/hospital/visit-activity-filler/related-activities/related-visit/related-visit.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
    imports: [
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        DatePipe,
        TranslatePipe,
        PersonNamePipe,
        MatCardContent,
        RelatedVisitComponent,
        MatProgressSpinner
    ],
    selector: 'app-related-visit-list',
    templateUrl: './related-visit-list.component.html',
    styleUrls: ['./related-visit-list.component.scss']
})
export class RelatedVisitListComponent {

    private readonly activityService = inject(VisitActivityService);

    public readonly visit = input.required<Visit>();

    protected readonly visits = signal<Array<WrappedVisitActivity>>([]);
    protected readonly loading = signal(false);

    constructor() {
        effect(() => {
            this.loading.set(true);
            this.activityService.getRelatedActivities(this.visit().id).subscribe({
                next: wrappedActivities => {
                    this.visits.set(wrappedActivities);
                    this.loading.set(false);
                }, error: () => {
                    this.loading.set(false);
                }
            });
        });
    }

}
