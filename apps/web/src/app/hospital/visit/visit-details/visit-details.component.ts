import {Component, inject} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {Router, RouterLink} from '@angular/router';
import {Location} from '@angular/common';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {CREATE_MARKER, CreateMarkerType, PATHS} from '@fe/app/app-paths';
import {
    ApiError,
    Visit,
    VisitCreate,
    VisitRewrite,
    VisitStatus,
    isNil,
    isNotNil,
    Permission
} from '@melluin/common';
import {VisitService} from '@fe/app/hospital/visit/visit.service';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {MessageService} from '@fe/app/util/message.service';
import {ReportPrepareService} from './report-prepare.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HttpErrorResponse} from '@angular/common/http';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {VisitConnectionsService} from '@fe/app/hospital/visit/visit-details/visit-connections.service';
import {VisitPresenterComponent} from '@fe/app/hospital/visit/visit-details/visit-presenter/visit-presenter.component';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIcon} from '@angular/material/icon';
import {VisitFormComponent} from '@fe/app/hospital/visit/visit-details/visit-form/visit-form.component';
import {VisitConnectionsComponent} from '@fe/app/hospital/visit/visit-details/visit-connections/visit-connections.component';
import {VisitActivitiesComponent} from '@fe/app/hospital/visit-activity/visit-activities/visit-activities.component';

@Component({
    selector: 'app-visit-details',
    templateUrl: './visit-details.component.html',
    styleUrls: ['./visit-details.component.scss'],
    imports: [
        VisitPresenterComponent,
        MatButton,
        TranslatePipe,
        RouterLink,
        MatIcon,
        VisitFormComponent,
        VisitConnectionsComponent,
        VisitActivitiesComponent
    ],
    providers: [RouteDataHandler, ReportPrepareService]
})
export class VisitDetailsComponent {

    private readonly router = inject(Router);
    private readonly location = inject(Location);
    private readonly msg = inject(MessageService);
    private readonly confirm = inject(ConfirmationService);
    private readonly route = inject(RouteDataHandler);
    private readonly visitService = inject(VisitService);
    private readonly visitConnectionsService = inject(VisitConnectionsService);
    private readonly reportPrepareService = inject(ReportPrepareService);
    protected readonly permissions = inject(PermissionService);

    Permission = Permission;

    protected isCreation = false;
    protected isEdit = false;
    protected createNewAfterSave = false;
    protected visit?: Visit;
    protected connectedVisits: Array<Visit> = [];

    constructor() {
        this.route.getData<Visit | CreateMarkerType>('visit').pipe(takeUntilDestroyed()).subscribe(
            visitInfo => this.setUp(visitInfo)
        );
    }

    protected isEditMode(): boolean {
        return this.isEdit || this.isCreation;
    }

    protected saveVisit(data: VisitRewrite | VisitCreate, options = {forceSameTimeVisit: false}): void {
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

        const visitStarted = this.visit.status === VisitStatus.SCHEDULED;
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

        const visitStarted = this.visit.status === VisitStatus.STARTED;
        const userHasCreateActivity = this.permissions.has(Permission.canCreateActivity);
        const userHasCreateActivityAny = this.permissions.has(Permission.canWriteActivityAtAnyVisit);
        const userParticipant = this.isUserParticipant();
        const userCanCreateActivity = userHasCreateActivityAny || (userHasCreateActivity && userParticipant)

        return visitStarted && userCanCreateActivity;
    }

    protected isFilledAndUserIsParticipant(): boolean {
        return isNotNil(this.visit)
            && this.visit.status === VisitStatus.ACTIVITIES_FILLED_OUT
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

    private setUp(visitInfo: Visit | CreateMarkerType): void {
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

    private createSaveRequest(data: VisitCreate | VisitRewrite, options: {
        forceSameTimeVisit: boolean
    }): Observable<Visit> {
        if (this.isCreation) {
            return this.visitService.addVisit(data as VisitCreate, options).pipe(tap(visit => {
                this.visit = visit;
                this.setIdInUrl(visit.id);
            }));
        }
        return this.visitService.updateVisit(this.visit!.id, data as VisitRewrite, options);
    }

    private handleSaveError(dataToSave: VisitRewrite | VisitCreate, error: HttpErrorResponse): void {
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

    private handleLimitExceededSaveError(dataToSave: VisitRewrite | VisitCreate): void {
        if (!this.permissions.has(Permission.canForceSameTimeVisitWrite)) {
            this.msg.error('ApiError.VISIT_SAME_TIME_SAME_DEPARTMENT_LIMIT_EXCEEDED');
            return;
        }
        this.confirm.getI18nConfirm({
            title: 'Visit.Form.SameTimeErrorTitle',
            message: 'Visit.Form.SameTimeErrorMessage',
            okBtnText: 'Visit.Form.SameTimeErrorOkText'
        }).then(() => this.saveVisit(dataToSave, {forceSameTimeVisit: true}));
    }

    private setIdInUrl(id: string): void {
        this.location.replaceState(`${PATHS.visit.main}/${id}`);
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
