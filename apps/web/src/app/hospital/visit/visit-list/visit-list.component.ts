import {Component, inject, input, signal} from '@angular/core';
import {DateUtil, Visit, VisitStatus, Permission} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Store} from '@ngrx/store';

@Component({
    selector: 'app-visit-list',
    templateUrl: './visit-list.component.html',
    styleUrls: ['./visit-list.component.scss']
})
export class VisitListComponent {

    protected readonly columns = ['status', 'date', 'department', 'participants', 'options'];

    private readonly store = inject(Store);
    private readonly permissions = inject(PermissionService);

    public readonly markRowByDate = input.required<boolean>();
    public readonly eventsList = input.required<Array<Visit>>();

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

    protected isFillButtonNeeded(visit: Visit): boolean {
        const userParticipant = visit.participants.some(p => p.id === this.permissions.personId);
        const userHasPermissionToFill = this.userCanModifyAnyVisit() || (userParticipant && this.userCanModifyVisit());

        const visitInRightStatus = [VisitStatus.SCHEDULED, VisitStatus.STARTED].includes(visit.status);

        return userHasPermissionToFill && visitInRightStatus;
    }

    protected isBeforeToday(visit: Visit): boolean {
        return visit.dateTimeTo < this.todayDawn;
    }

    protected isInToday(visit: Visit): boolean {
        return this.todayDawn < visit.dateTimeFrom
            && visit.dateTimeTo < this.tomorrowDawn;
    }

    protected isAfterToday(visit: Visit): boolean {
        return this.tomorrowDawn < visit.dateTimeFrom;
    }

    private getTomorrowDawn(): string {
        const date = DateUtil.now();
        date.setDate(date.getDate() + 1);
        return DateUtil.truncateToDay(date).toISOString();
    }

}
