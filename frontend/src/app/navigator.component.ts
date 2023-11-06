import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {selectUserHomePageSettings} from '@fe/app/state/selector/user-settings.selector';
import {HomePageOption, HomePageUserSettings} from '@shared/user/user-settings';
import {AutoUnSubscriber} from '@fe/app/util/auto-un-subscriber';
import {HospitalVisitService} from '@fe/app/hospital/visit/hospital-visit.service';
import {Platform} from '@angular/cdk/platform';
import {Router} from '@angular/router';
import {PATHS} from '@fe/app/app-paths';
import {FilterOperationBuilder} from '@shared/api-util/filter-options';
import {DateUtil} from '@shared/util/date-util';
import {CredentialStoreService} from '@fe/app/auth/service/credential-store.service';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {firstValueFrom, map} from 'rxjs';
import {isNilOrEmpty, isNotNil} from '@shared/util/util';

@Component({
    selector: 'app-navigator',
    template: ''
})
export class NavigatorComponent extends AutoUnSubscriber implements OnInit {

    private readonly availableVisitStatuses = [
        HospitalVisitStatus.SCHEDULED,
        HospitalVisitStatus.STARTED,
        HospitalVisitStatus.ACTIVITIES_FILLED_OUT,
        HospitalVisitStatus.ALL_FILLED_OUT,
        HospitalVisitStatus.SUCCESSFUL,
    ];

    private readonly visitStatusesWhenFillingEnabled = [
        HospitalVisitStatus.SCHEDULED,
        HospitalVisitStatus.STARTED,
    ];

    private mobileScreen: boolean;

    constructor(private readonly router: Router,
                private readonly platform: Platform,
                private readonly store: Store,
                private readonly credentialStoreService: CredentialStoreService,
                private readonly visitService: HospitalVisitService) {
        super();
    }

    public ngOnInit(): void {
        this.mobileScreen = (this.platform.IOS || this.platform.ANDROID);
        this.addSubscription(this.store.pipe(selectUserHomePageSettings), (userSettings?: HomePageUserSettings) => {
            this.processHomePage(this.mobileScreen ? userSettings?.inMobile : userSettings?.inDesktop);
        });
    }

    private processHomePage(option?: HomePageOption): Promise<boolean> {
        switch (option) {
            case HomePageOption.DASHBOARD:
                return this.router.navigate([PATHS.dashboard.main]);
            case HomePageOption.ACTUAL_HOSPITAL_VISIT_DETAILS:
            case HomePageOption.ACTUAL_HOSPITAL_VISIT_FILLER:
                return this.openVisitRelatedPage(option);
            case HomePageOption.EVENT_LIST:
            default:
                return this.router.navigate([PATHS.events.main]);
        }
    }

    private async openVisitRelatedPage(option: HomePageOption.ACTUAL_HOSPITAL_VISIT_DETAILS | HomePageOption.ACTUAL_HOSPITAL_VISIT_FILLER): Promise<boolean> {
        const visits = await this.createVisitRequest();
        if (isNilOrEmpty(visits)) {
            return this.router.navigate([PATHS.events.main]);
        }

        const fillableVisit = visits.find(visit => this.visitStatusesWhenFillingEnabled.includes(visit.status));
        if (option === HomePageOption.ACTUAL_HOSPITAL_VISIT_FILLER && isNotNil(fillableVisit)) {
            return this.router.navigate([PATHS.hospitalVisit.main, fillableVisit.id, PATHS.hospitalVisit.fillActivities]);
        }

        return this.router.navigate([PATHS.hospitalVisit.main, visits[0].id]);
    }

    private createVisitRequest(): Promise<Array<HospitalVisit>> {
        return firstValueFrom(this.visitService.findVisit({
            page: 1, size: 5, where: {
                dateTimeFrom: FilterOperationBuilder.lt(this.getTomorrowBegin()),
                dateTimeTo: FilterOperationBuilder.gte(DateUtil.truncateToDay(DateUtil.now())),
                'participants.id': FilterOperationBuilder.in([this.credentialStoreService.getUser()?.personId]),
                status: FilterOperationBuilder.in(this.availableVisitStatuses),
            }
        }).pipe(map(pageable => pageable.items)));
    }

    private getTomorrowBegin(): Date {
        const tomorrow = DateUtil.now()
        tomorrow.setDate(tomorrow.getDate() + 1);
        return DateUtil.truncateToDay(tomorrow);
    }

}
