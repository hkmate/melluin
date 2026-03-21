import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {Location} from '@angular/common';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {CREATE_MARKER, CreateMarkerType, PATHS} from '@fe/app/app-paths';
import {isNil, isNotNil, Permission, UUID, Visit, VisitStatuses} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {ReportPrepareService} from './report-prepare.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {VisitConnectionsService} from '@fe/app/hospital/visit/visit-details/visit-connections.service';
import {VisitPresenterComponent} from '@fe/app/hospital/visit/visit-details/visit-presenter/visit-presenter.component';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIcon} from '@angular/material/icon';
import {VisitFormComponent} from '@fe/app/hospital/visit/visit-details/visit-form/visit-form.component';
import {VisitConnectionsComponent} from '@fe/app/hospital/visit/visit-details/visit-connections/visit-connections.component';
import {VisitActivitiesComponent} from '@fe/app/hospital/visit-activity/visit-activities/visit-activities.component';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';

@Component({
    imports: [
        VisitPresenterComponent,
        MatButton,
        TranslatePipe,
        RouterLink,
        MatIcon,
        VisitFormComponent,
        VisitConnectionsComponent,
        VisitActivitiesComponent,
    ],
    providers: [RouteDataHandler, ReportPrepareService, DepartmentBoxService, VisitConnectionsService],
    selector: 'app-visit-details',
    templateUrl: './visit-details.component.html',
    styleUrls: ['./visit-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitDetailsComponent {

    protected readonly Permission = Permission;

    private readonly router = inject(Router);
    private readonly location = inject(Location);
    private readonly route = inject(RouteDataHandler);
    private readonly visitConnectionsService = inject(VisitConnectionsService);
    private readonly reportPrepareService = inject(ReportPrepareService);
    protected readonly permissions = inject(PermissionService);

    protected readonly isEdit = signal(false);
    protected readonly createNewAfterSave = signal(false);
    protected readonly visit = signal<Visit | undefined>(undefined);
    protected readonly connectedVisits = signal<Array<Visit>>([]);

    protected readonly canUserStartTheVisit = computed(() => this.computeCanUserStartTheVisit());
    protected readonly canUserEditTheVisit = computed(() => this.computeCanUserEditTheVisit());
    protected readonly isStartedAndUserCanContinueTheVisit = computed(() => this.computeIsStartedAndUserCanContinueTheVisit());
    protected readonly isFilledAndUserIsParticipant = computed(() => this.computeIsFilledAndUserIsParticipant());
    protected readonly shouldShowActivities = computed(() => this.computeShouldShowActivities());
    protected readonly shouldShowConnections = computed(() => this.computeShouldShowConnections());

    constructor() {
        this.route.getData<Visit | CreateMarkerType>('visit').pipe(takeUntilDestroyed()).subscribe(
            visitInfo => this.setUp(visitInfo)
        );
    }

    protected setVisit(newVisit: Visit): void {
        if (isNil(this.visit())) {
            this.setIdInUrl(newVisit.id);
        }
        this.visit.set(newVisit);
        this.setToPresent();
        if (this.createNewAfterSave()) {
            this.changeToAddOther();
        }
    }

    protected async prepareReport(): Promise<void> {
        const visit = this.visit();
        if (isNil(visit)) {
            return;
        }
        const connectedVisitIds = this.connectedVisits().map(v => v.id);
        const draftCreator = await this.reportPrepareService
            .draftCreator([visit.id, ...connectedVisitIds]);
        draftCreator.openReportDraft();
    }

    protected cancelEditing(): void {
        if (isNil(this.visit())) {
            this.router.navigate([PATHS.events.main]);
            return;
        }
        this.setToPresent();
    }

    protected switchToEdit(): void {
        this.isEdit.set(true);
        this.route.setParam('edit', true);
    }

    protected refreshConnections(): void {
        const visit = this.visit();
        if (isNil(visit)) {
            return;
        }
        this.visitConnectionsService.getConnections(visit.id).subscribe(connectedVisits => {
            this.connectedVisits.set(connectedVisits);
            this.updateVisitInstanceAfterConnectionRefresh();
        });
    }

    private computeCanUserStartTheVisit(): boolean {
        const visit = this.visit();
        if (isNil(visit)) {
            return false;
        }

        const visitStarted = visit.status === VisitStatuses.SCHEDULED;
        const userHasCreateActivity = this.permissions.has(Permission.canCreateActivity);
        const userHasCreateActivityAny = this.permissions.has(Permission.canWriteActivityAtAnyVisit);
        const userParticipant = this.isUserParticipant();
        const userCanCreateActivity = userHasCreateActivityAny || (userHasCreateActivity && userParticipant)

        return visitStarted && userCanCreateActivity && this.canUserEditTheVisit();
    }

    private computeCanUserEditTheVisit(): boolean {
        if (isNil(this.visit())) {
            return false;
        }
        const userCanModify = this.permissions.has(Permission.canModifyVisit);
        const userCanModifyAny = this.permissions.has(Permission.canModifyAnyVisit);
        const userParticipant = this.isUserParticipant();

        return userCanModifyAny || (userParticipant && userCanModify);
    }

    private computeIsStartedAndUserCanContinueTheVisit(): boolean {
        const visit = this.visit();
        if (isNil(visit)) {
            return false;
        }
        const visitStarted = visit.status === VisitStatuses.STARTED;
        const userHasCreateActivity = this.permissions.has(Permission.canCreateActivity);
        const userHasCreateActivityAny = this.permissions.has(Permission.canWriteActivityAtAnyVisit);
        const userParticipant = this.isUserParticipant();
        const userCanCreateActivity = userHasCreateActivityAny || (userHasCreateActivity && userParticipant)

        return visitStarted && userCanCreateActivity;
    }

    private computeIsFilledAndUserIsParticipant(): boolean {
        const visit = this.visit();
        return isNotNil(visit)
            && visit.status === VisitStatuses.ACTIVITIES_FILLED_OUT
            && this.isUserParticipant()
    }

    private computeShouldShowActivities(): boolean {
        return isNotNil(this.visit())
            && this.permissions.has(Permission.canReadActivity)
    }

    private computeShouldShowConnections(): boolean {
        return isNotNil(this.connectedVisits())
            && this.permissions.has(Permission.canReadVisitConnections)
    }

    private isUserParticipant(): boolean {
        const visit = this.visit();
        if (isNil(visit)) {
            return false;
        }
        return visit.participants.map(p => p.id).includes(this.permissions.personId!);
    }

    private setToPresent(): void {
        this.isEdit.set(false);
        this.route.removeParam('edit');
    }

    private setUp(visitInfo: Visit | CreateMarkerType): void {
        if (visitInfo === CREATE_MARKER) {
            this.visit.set(undefined);
            this.connectedVisits.set([]);
            this.switchToEdit();
        } else {
            this.isEdit.set(this.route.getParam('edit') === 'true');
            this.visit.set(visitInfo);
            this.setUpConnections(visitInfo.id)
        }
    }

    private setUpConnections(visitId: UUID): void {
        if (this.shouldShowConnections()) {
            this.visitConnectionsService.getConnections(visitId).subscribe(connectedVisits => {
                this.connectedVisits.set(connectedVisits);
            });
        }
    }

    private setIdInUrl(id: UUID | CreateMarkerType): void {
        this.location.replaceState(`${PATHS.visit.main}/${id}`);
    }

    private changeToAddOther(): void {
        // Note: need this to recreate the form component.
        setTimeout(() => {
            this.setIdInUrl(CREATE_MARKER);
            this.setUp(CREATE_MARKER);
        });
    }

    private updateVisitInstanceAfterConnectionRefresh(): void {
        const visit = this.visit();
        if (isNil(visit)) {
            return;
        }
        const visitInGroup = visit.id !== visit.connectionGroupId;
        const hasConnections = this.connectedVisits().length > 0;
        if (!visitInGroup && hasConnections) {
            this.visit.set({...visit, connectionGroupId: this.connectedVisits()[0].connectionGroupId});
        }
        if (visitInGroup && !hasConnections) {
            this.visit.set({...visit, connectionGroupId: visit.id});
        }
    }

}
