import {Component, inject} from '@angular/core';
import {Observable, tap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {CREATE_MARKER, CreateMarkerType, PATHS} from '@fe/app/app-paths';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitService} from '@fe/app/hospital/visit/hospital-visit.service';
import {HospitalVisitCreate} from '@shared/hospital-visit/hospital-visit-create';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Permission} from '@shared/user/permission.enum';
import {MessageService} from '@fe/app/util/message.service';
import {isNil, isNotNil} from '@shared/util/util';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {ReportPrepareService} from './report-prepare.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '@shared/api-util/api-error';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {HospitalVisitConnectionsService} from '@fe/app/hospital/visit/hospital-visit-details/hospital-visit-connections.service';

@Component({
    selector: 'app-hospital-visit-details',
    templateUrl: './hospital-visit-details.component.html',
    styleUrls: ['./hospital-visit-details.component.scss'],
    providers: [RouteDataHandler, ReportPrepareService]
})
export class HospitalVisitDetailsComponent {

    private readonly router = inject(Router);
    private readonly location = inject(Location);
    protected readonly permissions = inject(PermissionService);
    private readonly msg = inject(MessageService);
    private readonly confirm = inject(ConfirmationService);
    private readonly route = inject(RouteDataHandler);
    private readonly visitService = inject(HospitalVisitService);
    private readonly visitConnectionsService = inject(HospitalVisitConnectionsService);
    private readonly reportPrepareService = inject(ReportPrepareService);

    Permission = Permission;

    protected isCreation = false;
    protected isEdit = false;
    protected createNewAfterSave = false;
    protected visit?: HospitalVisit;
    protected connectedVisits: Array<HospitalVisit> = [];

    constructor() {
        this.route.getData<HospitalVisit | CreateMarkerType>('visit').pipe(takeUntilDestroyed()).subscribe(
            visitInfo => this.setUp(visitInfo)
        );
    }

    protected isEditMode(): boolean {
        return this.isEdit || this.isCreation;
    }

    protected saveVisit(data: HospitalVisitRewrite | HospitalVisitCreate, options = {forceSameTimeVisit: false}): void {
        this.createSaveRequest(data, options).subscribe({
            next: visit => {
                this.msg.success('SaveSuccessful');
                this.visit = visit;
                this.setToPresent();
                if (this.createNewAfterSave) {
                    this.changeToAddOther();
                }
            },
            error: err => this.handleSaveError(data, err)
        });
    }

    protected async prepareReport(): Promise<void> {
        if (isNil(this.visit)) {
            return;
        }
        const connectedVisitIds = this.connectedVisits.map(v => v.id);
        const draftCreator = await this.reportPrepareService
            .draftCreator([this.visit.id, ...connectedVisitIds]);
        draftCreator.openReportDraft();
    }

    protected cancelEditing(): void {
        if (this.isCreation) {
            this.router.navigate([PATHS.events.main]);
        }
        this.setToPresent();
    }

    protected switchToEdit(): void {
        this.isEdit = true;
        this.route.setParam('edit', true);
    }

    protected canUserStartTheVisit(): boolean {
        if (isNil(this.visit)) {
            return false;
        }

        const visitStarted = this.visit.status === HospitalVisitStatus.SCHEDULED;
        const userHasCreateActivity = this.permissions.has(Permission.canCreateActivity);
        const userHasCreateActivityAny = this.permissions.has(Permission.canWriteActivityAtAnyVisit);
        const userParticipant = this.isUserParticipant();
        const userCanCreateActivity = userHasCreateActivityAny || (userHasCreateActivity && userParticipant)

        return visitStarted && userCanCreateActivity && this.canUserEditTheVisit();
    }

    protected canUserEditTheVisit(): boolean {
        if (isNil(this.visit)) {
            return false;
        }
        const userCanModify = this.permissions.has(Permission.canModifyVisit);
        const userCanModifyAny = this.permissions.has(Permission.canModifyAnyVisit);
        const userParticipant = this.isUserParticipant();

        return userCanModifyAny || (userParticipant && userCanModify);
    }

    protected isStartedAndUserCanContinueTheVisit(): boolean {
        if (isNil(this.visit)) {
            return false;
        }

        const visitStarted = this.visit.status === HospitalVisitStatus.STARTED;
        const userHasCreateActivity = this.permissions.has(Permission.canCreateActivity);
        const userHasCreateActivityAny = this.permissions.has(Permission.canWriteActivityAtAnyVisit);
        const userParticipant = this.isUserParticipant();
        const userCanCreateActivity = userHasCreateActivityAny || (userHasCreateActivity && userParticipant)

        return visitStarted && userCanCreateActivity;
    }

    protected isFilledAndUserIsParticipant(): boolean {
        return isNotNil(this.visit)
            && this.visit.status === HospitalVisitStatus.ACTIVITIES_FILLED_OUT
            && this.isUserParticipant()
    }

    protected shouldShowActivities(): boolean {
        return isNotNil(this.visit)
            && this.permissions.has(Permission.canReadActivity)
    }

    protected shouldShowConnections(): boolean {
        return isNotNil(this.connectedVisits)
            && this.permissions.has(Permission.canReadVisitConnections)
    }

    protected refreshConnections(): void {
        if (isNil(this.visit)) {
            return;
        }
        this.visitConnectionsService.getConnections(this.visit.id).subscribe(connectedVisits => {
            this.connectedVisits = connectedVisits;
            this.updateVisitInstanceAfterConnectionRefresh();
        });
    }

    private isUserParticipant(): boolean {
        if (isNil(this.visit)) {
            return false;
        }
        return this.visit.participants.map(p => p.id).includes(this.permissions.personId!);
    }

    private setToPresent(): void {
        this.isEdit = false;
        this.isCreation = false;
        this.route.removeParam('edit');
    }

    private setUp(visitInfo: HospitalVisit | CreateMarkerType): void {
        this.isEdit = this.route.getParam('edit') === 'true';
        if (visitInfo === CREATE_MARKER) {
            this.connectedVisits = [];
            this.isCreation = true;
        } else {
            this.visit = visitInfo;
            this.setUpConnections(visitInfo.id)
        }
    }

    private setUpConnections(visitId: string): void {
        if (this.shouldShowConnections()) {
            this.visitConnectionsService.getConnections(visitId).subscribe(connectedVisits => {
                this.connectedVisits = connectedVisits;
            });
        }
    }

    private createSaveRequest(data: HospitalVisitCreate | HospitalVisitRewrite, options: {
        forceSameTimeVisit: boolean
    }): Observable<HospitalVisit> {
        if (data instanceof HospitalVisitRewrite) {
            return this.visitService.updateVisit(this.visit!.id, data, options);
        }
        if (data instanceof HospitalVisitCreate) {
            return this.visitService.addVisit(data, options).pipe(tap(visit => {
                this.visit = visit;
                this.setIdInUrl(visit.id);
            }));
        }
        return throwError(() => new Error('Invalid data to save.'));
    }

    private handleSaveError(dataToSave: HospitalVisitRewrite | HospitalVisitCreate, error: HttpErrorResponse): void {
        if (!('code' in error.error)) {
            this.msg.errorRaw(error.message);
            return;
        }
        if (error.error.code === ApiError.VISIT_SAME_TIME_SAME_DEPARTMENT_LIMIT_EXCEEDED) {
            this.handleLimitExceededSaveError(dataToSave);
            return;
        }
        this.msg.error(`ApiError.${error.error.code}`);
    }

    private handleLimitExceededSaveError(dataToSave: HospitalVisitRewrite | HospitalVisitCreate): void {
        if (!this.permissions.has(Permission.canForceSameTimeVisitWrite)) {
            this.msg.error('ApiError.VISIT_SAME_TIME_SAME_DEPARTMENT_LIMIT_EXCEEDED');
            return;
        }
        this.confirm.getI18nConfirm({
            title: 'HospitalVisit.Form.SameTimeErrorTitle',
            message: 'HospitalVisit.Form.SameTimeErrorMessage',
            okBtnText: 'HospitalVisit.Form.SameTimeErrorOkText'
        }).then(() => this.saveVisit(dataToSave, {forceSameTimeVisit: true}));
    }

    private setIdInUrl(id: string): void {
        this.location.replaceState(`${PATHS.hospitalVisit.main}/${id}`);
    }

    private changeToAddOther(): void {
        // Note: need this to recreate the form component. Later should be done better.
        setTimeout(() => {
            this.visit = undefined;
            this.isCreation = true;
            this.setIdInUrl(CREATE_MARKER);
        });
    }

    private updateVisitInstanceAfterConnectionRefresh(): void {
        if (isNil(this.visit)) {
            return;
        }
        const visitInGroup = this.visit.id !== this.visit.connectionGroupId;
        const hasConnections = this.connectedVisits.length > 0;
        if (!visitInGroup && hasConnections) {
            this.visit = {...this.visit, connectionGroupId: this.connectedVisits[0].connectionGroupId};
        }
        if (visitInGroup && !hasConnections) {
            this.visit = {...this.visit, connectionGroupId: this.visit.id};
        }
    }

}
