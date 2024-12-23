import {Component, OnInit} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {firstValueFrom} from 'rxjs';
import {Router} from '@angular/router';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {HospitalVisitService} from '@fe/app/hospital/visit/hospital-visit.service';
import {CREATE_MARKER, CreateMarkerType} from '@fe/app/app-paths';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Permission} from '@shared/user/permission.enum';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {isNilOrEmpty, NOOP} from '@shared/util/util';
import {AutoUnSubscriber} from '@fe/app/util/auto-un-subscriber';
import {MessageService} from '@fe/app/util/message.service';

@Component({
    selector: 'app-hospital-visit-activity-filler',
    templateUrl: './hospital-visit-activity-filler.component.html',
    styleUrls: ['./hospital-visit-activity-filler.component.scss'],
    providers: [RouteDataHandler]
})
export class HospitalVisitActivityFillerComponent extends AutoUnSubscriber implements OnInit {

    HospitalVisitStatus = HospitalVisitStatus;

    private static readonly CLOSED_STATUSES = [HospitalVisitStatus.SUCCESSFUL,
        HospitalVisitStatus.CANCELED, HospitalVisitStatus.FAILED_BECAUSE_NO_CHILD, HospitalVisitStatus.FAILED_FOR_OTHER_REASON];

    protected visit: HospitalVisit;
    protected buttonsEnabled = true;
    protected childrenAdded: boolean;
    protected activitiesAdded: boolean;

    constructor(private readonly router: Router,
                private readonly route: RouteDataHandler,
                private readonly confirmDialog: ConfirmationService,
                private readonly msg: MessageService,
                protected readonly permissions: PermissionService,
                private readonly visitService: HospitalVisitService,
                private readonly filler: HospitalVisitActivityFillerService) {
        super();
    }

    public ngOnInit(): void {
        this.addSubscription(this.route.getData<HospitalVisit | CreateMarkerType>('visit'),
            visitInfo => {
                this.setUp(visitInfo);
            }
        );
        this.addSubscription(this.filler.getChildren(), children => {
            this.childrenAdded = !isNilOrEmpty(children);
        });
        this.addSubscription(this.filler.getActivities(), activities => {
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
        const rewrite = HospitalVisitRewrite.from(this.visit!);
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
