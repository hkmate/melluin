import {Component, input, signal, inject} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {DateUtil} from '@shared/util/date-util';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Store} from '@ngrx/store';
import {Permission} from '@shared/user/permission.enum';

@Component({
    selector: 'app-hospital-events-list',
    templateUrl: './hospital-events-list.component.html',
    styleUrls: ['./hospital-events-list.component.scss']
})
export class HospitalEventsListComponent {

    protected readonly columns = ['status', 'date', 'department', 'participants', 'options'];

    private readonly store = inject(Store);
    private readonly permissions = inject(PermissionService);

    public readonly markRowByDate = input.required<boolean>();
    public readonly eventsList = input.required<Array<HospitalVisit>>();

    protected readonly userCanReadConnections = signal(false);
    private readonly userCanModifyVisit = signal(false);
    private readonly userCanModifyAnyVisit = signal(false);

    private todayDawn = DateUtil.truncateToDay(DateUtil.now()).toISOString();
    private tomorrowDawn = this.getTomorrowDawn();

    constructor() {
        this.store.pipe(selectCurrentUser, takeUntilDestroyed()).subscribe(() => {
                this.userCanModifyVisit.set(this.permissions.has(Permission.canModifyVisit));
                this.userCanModifyAnyVisit.set(this.permissions.has(Permission.canModifyAnyVisit));
                this.userCanReadConnections.set(this.permissions.has(Permission.canReadVisitConnections));
            }
        );
    }

    protected isFillButtonNeeded(visit: HospitalVisit): boolean {
        const userParticipant = visit.participants.some(p => p.id === this.permissions.personId);
        const userHasPermissionToFill = this.userCanModifyAnyVisit() || (userParticipant && this.userCanModifyVisit());

        const visitInRightStatus = [HospitalVisitStatus.SCHEDULED, HospitalVisitStatus.STARTED].includes(visit.status);

        return userHasPermissionToFill && visitInRightStatus;
    }

    protected isBeforeToday(visit: HospitalVisit): boolean {
        return visit.dateTimeTo < this.todayDawn;
    }

    protected isInToday(visit: HospitalVisit): boolean {
        return this.todayDawn < visit.dateTimeFrom
            && visit.dateTimeTo < this.tomorrowDawn;
    }

    protected isAfterToday(visit: HospitalVisit): boolean {
        return this.tomorrowDawn < visit.dateTimeFrom;
    }

    private getTomorrowDawn(): string {
        const date = DateUtil.now();
        date.setDate(date.getDate() + 1);
        return DateUtil.truncateToDay(date).toISOString();
    }

}
