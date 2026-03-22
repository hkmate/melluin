import {Component, computed, inject, input} from '@angular/core';
import {isNilOrEmpty, Permission, WrappedVisitActivity} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {convertToChildrenById} from '@fe/app/hospital/visit-activity-filler/model/visited-child-by-id';
import {MatCard, MatCardContent} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';
import {RelatedVisitChildComponent} from '@fe/app/hospital/visit-activity-filler/related-activities/related-visit-child/related-visit-child.component';
import {RelatedActivityComponent} from '@fe/app/hospital/visit-activity-filler/related-activities/related-activity/related-activity.component';

@Component({
    imports: [
        MatCard,
        TranslatePipe,
        MatCardContent,
        RelatedVisitChildComponent,
        RelatedActivityComponent
    ],
    selector: 'app-related-visit',
    templateUrl: './related-visit.component.html',
    styleUrls: ['./related-visit.component.scss']
})
export class RelatedVisitComponent {

    protected readonly Permission = Permission;
    protected readonly permissions = inject(PermissionService);

    public readonly wrappedActivity = input.required<WrappedVisitActivity>();

    protected readonly information = computed(() => this.wrappedActivity().info);
    protected readonly childrenById = computed(() => convertToChildrenById(this.wrappedActivity().children));
    protected readonly infoIsEmpty = computed(() => isNilOrEmpty(this.information()?.content));
    protected readonly visitDate = computed(() => new Date(this.wrappedActivity().visit.dateTimeFrom));

}
