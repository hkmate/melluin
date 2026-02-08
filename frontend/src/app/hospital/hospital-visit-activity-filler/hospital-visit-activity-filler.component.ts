import {Component, inject} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {firstValueFrom} from 'rxjs';
import {Router} from '@angular/router';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {HospitalVisitService} from '@fe/app/hospital/visit/hospital-visit.service';
import {CREATE_MARKER, CreateMarkerType} from '@fe/app/app-paths';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {createVisitRewrite, HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Permission} from '@shared/user/permission.enum';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {isNilOrEmpty, NOOP} from '@shared/util/util';
import {MessageService} from '@fe/app/util/message.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ContinueOtherVisitDialogService} from '@fe/app/hospital/hospital-visit-activity-filler/continue-other/continue-other-visit-dialog.service';

@Component({
    selector: 'app-hospital-visit-activity-filler',
    templateUrl: './hospital-visit-activity-filler.component.html',
    styleUrls: ['./hospital-visit-activity-filler.component.scss'],
    providers: [RouteDataHandler]
})
export class HospitalVisitActivityFillerComponent {

    HospitalVisitStatus = HospitalVisitStatus;
    private static readonly CLOSED_STATUSES = [
        HospitalVisitStatus.DRAFT,
        HospitalVisitStatus.ACTIVITIES_FILLED_OUT,
        HospitalVisitStatus.ALL_FILLED_OUT,
        HospitalVisitStatus.SUCCESSFUL,
        HospitalVisitStatus.CANCELED,
        HospitalVisitStatus.FAILED_BECAUSE_NO_CHILD,
        HospitalVisitStatus.FAILED_FOR_OTHER_REASON
    ];

    private readonly router = inject(Router);
    private readonly route = inject(RouteDataHandler);
    private readonly confirmDialog = inject(ConfirmationService);
    private readonly msg = inject(MessageService);
    protected readonly permissions = inject(PermissionService);
    private readonly visitService = inject(HospitalVisitService);
    private readonly filler = inject(HospitalVisitActivityFillerService);
    private readonly continueOtherVisitDialogService = inject(ContinueOtherVisitDialogService);

    protected visit: HospitalVisit;
    protected buttonsEnabled = true;
    protected childrenAdded: boolean;
    protected activitiesAdded: boolean;

    constructor() {
        this.route.getData<HospitalVisit | CreateMarkerType>('visit').pipe(takeUntilDestroyed()).subscribe(
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
        return this.visit?.status === HospitalVisitStatus.STARTED
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
        return !this.childrenAdded && !HospitalVisitActivityFillerComponent.CLOSED_STATUSES.includes(this.visit.status);
    }

    protected canVisitBeStarted(): boolean {
        return this.visit?.status === HospitalVisitStatus.SCHEDULED
            && this.permissions.has(Permission.canCreateActivity);
    }

    protected triggerStartFilling(): void {
        this.startFilling();
    }

    protected triggerFinalizeFilling(): void {
        if (!this.isVisitFilled()) {
            this.msg.error('HospitalVisit.FillingIsNotCompleted');
            return;
        }
        this.confirmDialog.getI18nConfirm({
            message: 'HospitalVisit.AreYouSureFinalize',
            okBtnText: 'YesNo.true'
        })
            .then(() => this.finalizeFilling(HospitalVisitStatus.ACTIVITIES_FILLED_OUT))
            .catch(NOOP);
    }

    protected openContinueOtherDialog(): void {
        if (!this.isVisitFilled()) {
            this.msg.error('HospitalVisit.FillingIsNotCompleted');
            return;
        }
        this.continueOtherVisitDialogService.askContinueInfo(this.visit)
            .then(visit => this.setUp(visit))
            .catch(NOOP);
    }

    protected triggerFailedVisit(status: HospitalVisitStatus): void {
        if (![HospitalVisitStatus.FAILED_BECAUSE_NO_CHILD, HospitalVisitStatus.FAILED_FOR_OTHER_REASON].includes(status)) {
            return;
        }
        const msg
            = status === HospitalVisitStatus.FAILED_BECAUSE_NO_CHILD
            ? 'HospitalVisit.AreYouSureFailBecauseNoChild'
            : 'HospitalVisit.AreYouSureFailBecauseOtherReason'
        this.confirmDialog.getI18nConfirm({message: msg, okBtnText: 'YesNo.true'})
            .then(() => this.finalizeFilling(status)).catch(NOOP);
    }

    private isVisitFilled(): boolean {
        return this.childrenAdded && this.activitiesAdded;
    }

    private startFilling(): void {
        this.saveVisit(HospitalVisitStatus.STARTED).then(() => this.filler.statusChanged(HospitalVisitStatus.STARTED));
    }

    private finalizeFilling(status: HospitalVisitStatus): void {
        this.saveVisit(status)
            .then(() => {
                this.router.navigate(['/hospital-visits', this.visit.id]);
            });
    }

    private setUp(visitInfo: HospitalVisit | CreateMarkerType): void {
        if (visitInfo === CREATE_MARKER) {
            throw new Error('Visit creation is not enabled when fill activities');
        }
        this.visit = visitInfo;
        this.verifyVisitHasSupportedStatus();
        this.filler.startFilling(visitInfo);
    }

    protected saveVisit(newStatus: HospitalVisitStatus): Promise<void> {
        this.buttonsEnabled = false;
        return firstValueFrom(this.visitService.updateVisit(this.visit!.id, this.createSaveRequest(newStatus)))
            .then(visit => {
                this.visit = visit;
                this.buttonsEnabled = true;
            });
    }

    private createSaveRequest(newStatus: HospitalVisitStatus): HospitalVisitRewrite {
        const rewrite = createVisitRewrite(this.visit!);
        rewrite.status = newStatus;
        return rewrite;
    }

    private verifyVisitHasSupportedStatus(): void {
        const isStatusCorrect = [HospitalVisitStatus.SCHEDULED, HospitalVisitStatus.STARTED].includes(this.visit.status);
        if (!isStatusCorrect) {
            throw new Error('Fill activities is disabled when visit is not in status SCHEDULED or STARTED');
        }
    }

}
