import {Component, inject} from '@angular/core';
import {
    createVisitRewrite,
    Visit,
    VisitRewrite,
    VisitStatus,
    isNilOrEmpty,
    NOOP,
    Permission
} from '@melluin/common';
import {firstValueFrom} from 'rxjs';
import {Router} from '@angular/router';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {VisitService} from '@fe/app/hospital/visit/visit.service';
import {CREATE_MARKER, CreateMarkerType} from '@fe/app/app-paths';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {VisitActivityFillerService} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.service';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {MessageService} from '@fe/app/util/message.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ContinueOtherVisitDialogService} from '@fe/app/hospital/visit-activity-filler/continue-other/continue-other-visit-dialog.service';

@Component({
    selector: 'app-visit-activity-filler',
    templateUrl: './visit-activity-filler.component.html',
    styleUrls: ['./visit-activity-filler.component.scss'],
    providers: [RouteDataHandler]
})
export class VisitActivityFillerComponent {

    VisitStatus = VisitStatus;
    private static readonly CLOSED_STATUSES = [
        VisitStatus.DRAFT,
        VisitStatus.ACTIVITIES_FILLED_OUT,
        VisitStatus.ALL_FILLED_OUT,
        VisitStatus.SUCCESSFUL,
        VisitStatus.CANCELED,
        VisitStatus.FAILED_BECAUSE_NO_CHILD,
        VisitStatus.FAILED_FOR_OTHER_REASON
    ];

    private readonly router = inject(Router);
    private readonly route = inject(RouteDataHandler);
    private readonly confirmDialog = inject(ConfirmationService);
    private readonly msg = inject(MessageService);
    protected readonly permissions = inject(PermissionService);
    private readonly visitService = inject(VisitService);
    private readonly filler = inject(VisitActivityFillerService);
    private readonly continueOtherVisitDialogService = inject(ContinueOtherVisitDialogService);

    protected visit: Visit;
    protected buttonsEnabled = true;
    protected childrenAdded: boolean;
    protected activitiesAdded: boolean;

    constructor() {
        this.route.getData<Visit | CreateMarkerType>('visit').pipe(takeUntilDestroyed()).subscribe(
            visitInfo => {
                this.setUp(visitInfo);
            }
        );
        this.filler.getChildren().pipe(takeUntilDestroyed()).subscribe(children => {
            this.childrenAdded = !isNilOrEmpty(children);
        });
        this.filler.getActivities().pipe(takeUntilDestroyed()).subscribe(activities => {
            this.activitiesAdded = !isNilOrEmpty(activities);
        });
    }

    protected canActivitiesBeShowed(): boolean {
        return this.visit?.status === VisitStatus.STARTED
            && this.permissions.has(Permission.canReadActivity)
    }

    protected canActivitiesBeFinalized(): boolean {
        return this.permissions.has(Permission.canCreateActivity)
            && this.canActivitiesBeShowed();
    }

    protected canContinueInOtherVisit(): boolean {
        return this.canActivitiesBeFinalized() && this.permissions.has(Permission.canCreateVisit);
    }

    protected canSetVisitToFailed(): boolean {
        return !this.childrenAdded && !VisitActivityFillerComponent.CLOSED_STATUSES.includes(this.visit.status);
    }

    protected canVisitBeStarted(): boolean {
        return this.visit?.status === VisitStatus.SCHEDULED
            && this.permissions.has(Permission.canCreateActivity);
    }

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
        })
            .then(() => this.finalizeFilling(VisitStatus.ACTIVITIES_FILLED_OUT))
            .catch(NOOP);
    }

    protected openContinueOtherDialog(): void {
        if (!this.isVisitFilled()) {
            this.msg.error('Visit.FillingIsNotCompleted');
            return;
        }
        this.continueOtherVisitDialogService.askContinueInfo(this.visit)
            .then(visit => this.setUp(visit))
            .catch(NOOP);
    }

    protected triggerFailedVisit(status: VisitStatus): void {
        if (![VisitStatus.FAILED_BECAUSE_NO_CHILD, VisitStatus.FAILED_FOR_OTHER_REASON].includes(status)) {
            return;
        }
        const msg
            = status === VisitStatus.FAILED_BECAUSE_NO_CHILD
            ? 'Visit.AreYouSureFailBecauseNoChild'
            : 'Visit.AreYouSureFailBecauseOtherReason'
        this.confirmDialog.getI18nConfirm({message: msg, okBtnText: 'YesNo.true'})
            .then(() => this.finalizeFilling(status)).catch(NOOP);
    }

    private isVisitFilled(): boolean {
        return this.childrenAdded && this.activitiesAdded;
    }

    private startFilling(): void {
        this.saveVisit(VisitStatus.STARTED).then(() => this.filler.statusChanged(VisitStatus.STARTED));
    }

    private finalizeFilling(status: VisitStatus): void {
        this.saveVisit(status)
            .then(() => {
                this.router.navigate(['/visits', this.visit.id]);
            });
    }

    private setUp(visitInfo: Visit | CreateMarkerType): void {
        if (visitInfo === CREATE_MARKER) {
            throw new Error('Visit creation is not enabled when fill activities');
        }
        this.visit = visitInfo;
        this.verifyVisitHasSupportedStatus();
        this.filler.startFilling(visitInfo);
    }

    protected saveVisit(newStatus: VisitStatus): Promise<void> {
        this.buttonsEnabled = false;
        return firstValueFrom(this.visitService.updateVisit(this.visit!.id, this.createSaveRequest(newStatus)))
            .then(visit => {
                this.visit = visit;
                this.buttonsEnabled = true;
            });
    }

    private createSaveRequest(newStatus: VisitStatus): VisitRewrite {
        const rewrite = createVisitRewrite(this.visit!);
        rewrite.status = newStatus;
        return rewrite;
    }

    private verifyVisitHasSupportedStatus(): void {
        const isStatusCorrect = [VisitStatus.SCHEDULED, VisitStatus.STARTED].includes(this.visit.status);
        if (!isStatusCorrect) {
            throw new Error('Fill activities is disabled when visit is not in status SCHEDULED or STARTED');
        }
    }

}
