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
    private readonly route = inject(RouteDataHandler);
    private readonly visitService = inject(HospitalVisitService);
    private readonly reportPrepareService = inject(ReportPrepareService);

    Permission = Permission;

    protected isCreation = false;
    protected isEdit = false;
    protected createNewAfterSave = false;
    protected visit?: HospitalVisit;

    constructor() {
        this.route.getData<HospitalVisit | CreateMarkerType>('visit').pipe(takeUntilDestroyed()).subscribe(
            visitInfo => this.setUp(visitInfo)
        );
    }

    protected isEditMode(): boolean {
        return this.isEdit || this.isCreation;
    }

    protected saveVisit(data: HospitalVisitRewrite | HospitalVisitCreate): void {
        this.createSaveRequest(data).subscribe(visit => {
            this.msg.success('SaveSuccessful');
            this.visit = visit;
            this.setToPresent();
            if (this.createNewAfterSave) {
                this.changeToAddOther();
            }
        });
    }

    protected async prepareReport(): Promise<void> {
        if (isNil(this.visit)) {
            return;
        }
        const draftCreater = await this.reportPrepareService.draftCreater(this.visit.id)
        draftCreater.openReportDraft();
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
        return isNotNil(this.visit)
            && this.visit.status === HospitalVisitStatus.SCHEDULED
            && this.permissions.has(Permission.canCreateActivity)
    }

    protected isStartedAndUserCanContinueTheVisit(): boolean {
        return isNotNil(this.visit)
            && this.visit.status === HospitalVisitStatus.STARTED
            && this.permissions.has(Permission.canCreateActivity)
    }

    protected isFilledAndUserIsParticipant(): boolean {
        return isNotNil(this.visit)
            && this.visit.status === HospitalVisitStatus.ACTIVITIES_FILLED_OUT
            && this.visit.participants.map(p => p.id).includes(this.permissions.personId!);
    }

    protected shouldShowActivities(): boolean {
        return isNotNil(this.visit)
            && this.permissions.has(Permission.canReadActivity)
    }

    private setToPresent(): void {
        this.isEdit = false;
        this.isCreation = false;
        this.route.removeParam('edit');
    }

    private setUp(visitInfo: HospitalVisit | CreateMarkerType): void {
        this.isEdit = this.route.getParam('edit') === 'true';
        if (visitInfo === CREATE_MARKER) {
            this.isCreation = true;
        } else {
            this.visit = visitInfo;
        }
    }

    private createSaveRequest(data: HospitalVisitCreate | HospitalVisitRewrite): Observable<HospitalVisit> {
        if (data instanceof HospitalVisitRewrite) {
            return this.visitService.updateVisit(this.visit!.id, data);
        }
        if (data instanceof HospitalVisitCreate) {
            return this.visitService.addVisit(data).pipe(tap(visit => {
                this.visit = visit;
                this.setIdInUrl(visit.id);
            }));
        }
        return throwError(() => new Error('Invalid data to save.'));
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

}
