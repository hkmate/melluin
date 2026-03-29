import {ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal} from '@angular/core';
import {
    createVisitRewrite,
    isNilOrEmpty,
    NOOP,
    Permission,
    Visit,
    VisitRewrite,
    VisitStatus,
    VisitStatuses
} from '@melluin/common';
import {firstValueFrom, map, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {VisitService} from '@fe/app/hospital/visit/visit.service';
import {CREATE_MARKER, CreateMarkerType, PATHS} from '@fe/app/app-paths';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {MessageService} from '@fe/app/util/message.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {ContinueOtherVisitDialogService} from '@fe/app/hospital/visit-activity-filler/continue-other/continue-other-visit-dialog.service';
import {VisitCardComponent} from '@fe/app/hospital/visit/visit-card/visit-card.component';
import {MatButton} from '@angular/material/button';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from '@angular/material/expansion';
import {TranslatePipe} from '@ngx-translate/core';
import {RelatedVisitListComponent} from '@fe/app/hospital/visit-activity-filler/related-activities/related-visit-list/related-visit-list.component';
import {ChildFillerListComponent} from '@fe/app/hospital/visit-activity-filler/fillers/child-filler-list/child-filler-list.component';
import {ActivityFillerListComponent} from '@fe/app/hospital/visit-activity-filler/fillers/activity-filler-list/activity-filler-list.component';
import {ActivitiesInformationFillerComponent} from '@fe/app/hospital/visit-activity-filler/fillers/activities-information-filler/activities-information-filler.component';
import {BoxInfoManagerComponent} from '@fe/app/hospital/department-box/department-box-info-manager/box-info-manager.component';
import {VisitActivityFillerFactory} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.factory';
import {Location} from '@angular/common';

const CLOSED_STATUSES: Array<VisitStatus> = [
    VisitStatuses.DRAFT,
    VisitStatuses.ACTIVITIES_FILLED_OUT,
    VisitStatuses.ALL_FILLED_OUT,
    VisitStatuses.SUCCESSFUL,
    VisitStatuses.CANCELED,
    VisitStatuses.FAILED_BECAUSE_NO_CHILD,
    VisitStatuses.FAILED_FOR_OTHER_REASON
];

@Component({
    imports: [
        VisitCardComponent,
        MatButton,
        MatAccordion,
        TranslatePipe,
        MatExpansionPanel,
        MatExpansionPanelTitle,
        MatExpansionPanelHeader,
        RelatedVisitListComponent,
        ChildFillerListComponent,
        ActivityFillerListComponent,
        ActivitiesInformationFillerComponent,
        BoxInfoManagerComponent
    ],
    providers: [
        RouteDataHandler,
        VisitActivityFillerFactory,
        ContinueOtherVisitDialogService
    ],
    selector: 'app-visit-activity-filler',
    templateUrl: './visit-activity-filler.component.html',
    styleUrls: ['./visit-activity-filler.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitActivityFillerComponent {

    VisitStatuses = VisitStatuses;

    private readonly router = inject(Router);
    private readonly location = inject(Location);
    private readonly route = inject(RouteDataHandler);
    private readonly confirmDialog = inject(ConfirmationService);
    private readonly msg = inject(MessageService);
    protected readonly permissions = inject(PermissionService);
    private readonly visitService = inject(VisitService);
    private readonly fillerFactory = inject(VisitActivityFillerFactory);
    private readonly continueOtherVisitDialogService = inject(ContinueOtherVisitDialogService);

    private readonly parsedVisit = toSignal(this.getVisitFromRouteData(), {requireSync: true});
    protected readonly visit = linkedSignal(() => this.parsedVisit());
    protected readonly filler = this.fillerFactory.createService(this.visit);
    protected readonly buttonsEnabled = signal(true);
    protected readonly childrenAdded = computed(() => !isNilOrEmpty(this.filler.getChildren()()));
    protected readonly activitiesAdded = computed(() => !isNilOrEmpty(this.filler.getActivities()()));

    protected canActivitiesBeShowed = computed(() =>
        this.visit().status === VisitStatuses.STARTED
        && this.permissions.has(Permission.canReadActivity)
    );

    protected canActivitiesBeFinalized = computed(() =>
        this.permissions.has(Permission.canCreateActivity)
        && this.canActivitiesBeShowed()
    );

    protected canContinueInOtherVisit = computed(() =>
        this.canActivitiesBeFinalized() && this.permissions.has(Permission.canCreateVisit)
    );

    protected canSetVisitToFailed = computed(() =>
        !this.childrenAdded() && !CLOSED_STATUSES.includes(this.visit().status)
    );

    protected canVisitBeStarted = computed(() =>
        this.visit().status === VisitStatuses.SCHEDULED && this.permissions.has(Permission.canCreateActivity)
    );

    protected triggerStartFilling(): void {
        this.startFilling();
    }

    protected triggerFinalizeFilling(): void {
        if (!this.isVisitFilled()) {
            this.msg.error('Visit.FillingIsNotCompleted');
            return;
        }
        this.confirmDialog.getI18nConfirm({
            message: 'Visit.AreYouSureFinalize',
            okBtnText: 'YesNo.true'
        }).then(() => this.finalizeFilling(VisitStatuses.ACTIVITIES_FILLED_OUT))
            .catch(NOOP);
    }

    protected openContinueOtherDialog(): void {
        if (!this.isVisitFilled()) {
            this.msg.error('Visit.FillingIsNotCompleted');
            return;
        }
        this.continueOtherVisitDialogService.askContinueInfo(this.visit())
            .then(visit => {
                this.visit.set(visit);
                this.location.replaceState(`${PATHS.visit}/${this.visit().id}/${PATHS.visit.fillActivities}`);
            })
            .catch(NOOP);
    }

    protected triggerFailedVisit(status: VisitStatus): void {
        if (!([VisitStatuses.FAILED_BECAUSE_NO_CHILD, VisitStatuses.FAILED_FOR_OTHER_REASON] as Array<VisitStatus>)
            .includes(status)) {
            return;
        }
        const msg
            = status === VisitStatuses.FAILED_BECAUSE_NO_CHILD
            ? 'Visit.AreYouSureFailBecauseNoChild'
            : 'Visit.AreYouSureFailBecauseOtherReason'
        this.confirmDialog.getI18nConfirm({message: msg, okBtnText: 'YesNo.true'})
            .then(() => this.finalizeFilling(status)).catch(NOOP);
    }

    private isVisitFilled(): boolean {
        return this.childrenAdded() && this.activitiesAdded();
    }

    private startFilling(): void {
        this.saveVisit(VisitStatuses.STARTED);
    }

    private async finalizeFilling(status: VisitStatus): Promise<void> {
        await this.saveVisit(status);
        this.router.navigate(['/visits', this.visit()!.id]);
    }

    private getVisitFromRouteData(): Observable<Visit> {
        return this.route.getData<Visit | CreateMarkerType>('visit').pipe(
            map(parsed => {
                if (parsed === CREATE_MARKER) {
                    throw new Error('Visit creation is not enabled when fill activities');
                }
                this.verifyVisitHasSupportedStatus(parsed);
                return parsed;
            }));
    }

    protected async saveVisit(newStatus: VisitStatus): Promise<void> {
        this.buttonsEnabled.set(false);
        const visit = await firstValueFrom(this.visitService.updateVisit(this.createSaveRequest(newStatus)));
        this.visit.set(visit);
        this.buttonsEnabled.set(true);
    }

    private createSaveRequest(newStatus: VisitStatus): VisitRewrite {
        const rewrite = createVisitRewrite(this.visit()!);
        rewrite.status = newStatus;
        return rewrite;
    }

    private verifyVisitHasSupportedStatus(visit: Visit): void {
        const isStatusCorrect = ([VisitStatuses.SCHEDULED, VisitStatuses.STARTED] as Array<VisitStatus>).includes(visit.status);
        if (!isStatusCorrect) {
            throw new Error('Fill activities is disabled when visit is not in status SCHEDULED or STARTED');
        }
    }

}
