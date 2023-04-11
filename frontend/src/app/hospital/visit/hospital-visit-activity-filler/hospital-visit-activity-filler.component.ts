import {Component, OnDestroy, OnInit} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {RouteDataHandler} from '@fe/app/util/route-data-handler/route-data-handler';
import {HospitalVisitService} from '@fe/app/hospital/visit/hospital-visit.service';
import {CREATE_MARKER, CreateMarkerType} from '@fe/app/app-paths';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {HospitalVisitRewrite} from '@shared/hospital-visit/hospital-visit-rewrite';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {Permission} from '@shared/user/permission.enum';
import {VisitTempDataService} from '@fe/app/hospital/visit-activity/visit-temp-data.service';

@Component({
    selector: 'app-hospital-visit-activity-filler',
    templateUrl: './hospital-visit-activity-filler.component.html',
    styleUrls: ['./hospital-visit-activity-filler.component.scss'],
    providers: [RouteDataHandler]
})
export class HospitalVisitActivityFillerComponent implements OnInit, OnDestroy {

    Permission: Permission;
    protected visit: HospitalVisit;
    protected buttonsEnabled = true;
    private resolverSubscription: Subscription;

    constructor(private readonly router: Router,
                private readonly location: Location,
                private readonly route: RouteDataHandler,
                protected readonly permissions: PermissionService,
                private readonly tempDataService: VisitTempDataService,
                private readonly visitService: HospitalVisitService) {
    }

    public ngOnInit(): void {
        this.resolverSubscription = this.route.getData<HospitalVisit | CreateMarkerType>('visit').subscribe(
            visitInfo => {
                this.setUp(visitInfo);
            }
        );
    }

    public ngOnDestroy(): void {
        this.resolverSubscription?.unsubscribe();
    }

    protected canActivitiesBeShowed(): boolean {
        return this.visit?.status === HospitalVisitStatus.STARTED
            && this.permissions.has(Permission.canReadActivity)
    }

    protected canActivitiesBeFinalized(): boolean {
        return this.permissions.has(Permission.canCreateActivity)
            && this.canActivitiesBeShowed();
    }

    protected canVisitBeStarted(): boolean {
        return this.visit?.status === HospitalVisitStatus.SCHEDULED
            && this.permissions.has(Permission.canCreateActivity);
    }

    protected isFillingEnabled(): boolean {
        return this.canActivitiesBeShowed()
            && this.permissions.has(Permission.canCreateActivity)
            && this.buttonsEnabled;
    }

    protected startFilling(): void {
        this.saveVisit(HospitalVisitStatus.STARTED);
    }

    protected finalizeFilling(): void {
        this.saveVisit(HospitalVisitStatus.JUST_REQUIRED_FIELDS_FILLED);
        this.tempDataService.removeAll(this.visit.id).subscribe();
    }

    private setUp(visitInfo: HospitalVisit | CreateMarkerType): void {
        if (visitInfo === CREATE_MARKER) {
            throw new Error('Visit creation is not enabled when fill activities');
        }
        this.visit = visitInfo;
        this.verifyVisitHasSupportedStatus();
    }

    protected saveVisit(newStatus: HospitalVisitStatus): void {
        this.buttonsEnabled = false;
        this.visitService.updateVisit(this.visit!.id, this.createSaveRequest(newStatus)).subscribe(visit => {
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
