import {Component, computed, effect, inject} from '@angular/core';
import {
    DateUtil,
    FilterOperationBuilder,
    HomePageOption,
    isNilOrEmpty,
    isNotNil,
    Visit,
    VisitStatus
} from '@melluin/common';
import {VisitService} from '@fe/app/hospital/visit/visit.service';
import {Platform} from '@angular/cdk/platform';
import {Router} from '@angular/router';
import {PATHS} from '@fe/app/app-paths';
import {firstValueFrom, map} from 'rxjs';
import {CurrentUserService} from '@fe/app/auth/service/current-user.service';

@Component({
    selector: 'app-navigator',
    template: ''
})
export class NavigatorComponent {

    private readonly router = inject(Router);
    private readonly platform = inject(Platform);
    private readonly currentUserService = inject(CurrentUserService);
    private readonly visitService = inject(VisitService);


    private readonly availableVisitStatuses = [
        VisitStatus.SCHEDULED,
        VisitStatus.STARTED,
        VisitStatus.ACTIVITIES_FILLED_OUT,
        VisitStatus.ALL_FILLED_OUT,
        VisitStatus.SUCCESSFUL,
    ];

    private readonly visitStatusesWhenFillingEnabled = [
        VisitStatus.SCHEDULED,
        VisitStatus.STARTED,
    ];

    private readonly homePageSettings = computed(() => this.currentUserService.userSettings()?.homePage);

    constructor() {
        effect(() => {
            const mobileScreen = this.platform.IOS || this.platform.ANDROID;
            this.processHomePage(mobileScreen ? this.homePageSettings()?.inMobile : this.homePageSettings()?.inDesktop)
        });
    }

    private processHomePage(option?: HomePageOption): Promise<boolean> {
        switch (option) {
            case HomePageOption.DASHBOARD:
                return this.router.navigate([PATHS.dashboard.main]);
            case HomePageOption.EVENT_LIST:
                return this.router.navigate([PATHS.events.main]);
            case HomePageOption.ACTUAL_HOSPITAL_VISIT_DETAILS:
            case HomePageOption.ACTUAL_HOSPITAL_VISIT_FILLER:
                return this.openVisitRelatedPage(option);
            default:
                return this.openDefaultPage();
        }
    }

    private async openVisitRelatedPage(option: HomePageOption.ACTUAL_HOSPITAL_VISIT_DETAILS | HomePageOption.ACTUAL_HOSPITAL_VISIT_FILLER): Promise<boolean> {
        const visits = await this.getMyTodayVisit();
        if (isNilOrEmpty(visits)) {
            return this.router.navigate([PATHS.events.main]);
        }

        const fillableVisit = visits.find(visit => this.visitStatusesWhenFillingEnabled.includes(visit.status));
        if (option === HomePageOption.ACTUAL_HOSPITAL_VISIT_FILLER && isNotNil(fillableVisit)) {
            return this.router.navigate([PATHS.visit.main, fillableVisit.id, PATHS.visit.fillActivities]);
        }

        return this.router.navigate([PATHS.visit.main, visits[0].id]);
    }

    private openDefaultPage(): Promise<boolean> {
        return this.openVisitRelatedPage(HomePageOption.ACTUAL_HOSPITAL_VISIT_FILLER);
    }

    private getMyTodayVisit(): Promise<Array<Visit>> {
        return firstValueFrom(this.visitService.findVisit({
            page: 1, size: 5, where: {
                dateTimeFrom: FilterOperationBuilder.lt(this.getTomorrowBegin()),
                dateTimeTo: FilterOperationBuilder.gte(DateUtil.truncateToDay(DateUtil.now())),
                'participants.id': FilterOperationBuilder.in([this.currentUserService.currentUser()?.personId]),
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
