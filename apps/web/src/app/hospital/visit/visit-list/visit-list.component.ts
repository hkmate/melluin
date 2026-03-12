import {Component, computed, inject, input} from '@angular/core';
import {DateUtil, Permission, Visit, VisitStatus, VisitStatuses} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable
} from '@angular/material/table';
import {VisitStatusIconComponent} from '@fe/app/hospital/visit/visit-status-icon/visit-status-icon.component';
import {DatePipe, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
    imports: [
        MatTable,
        MatColumnDef,
        MatHeaderCell,
        MatCell,
        MatCellDef,
        MatHeaderCellDef,
        VisitStatusIconComponent,
        DatePipe,
        TranslatePipe,
        RouterLink,
        PersonNamePipe,
        MatIcon,
        MatTooltip,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRow,
        MatRowDef,
        NgIf
    ],
    selector: 'app-visit-list',
    templateUrl: './visit-list.component.html',
    styleUrls: ['./visit-list.component.scss']
})
export class VisitListComponent {

    protected readonly columns = ['status', 'date', 'department', 'participants', 'options'];

    private readonly permissions = inject(PermissionService);

    public readonly markRowByDate = input.required<boolean>();
    public readonly eventsList = input.required<Array<Visit>>();

    protected readonly userCanReadConnections = computed(() => this.permissions.has(Permission.canReadVisitConnections));
    private readonly userCanModifyVisit = computed(() => this.permissions.has(Permission.canModifyVisit));
    private readonly userCanModifyAnyVisit = computed(() => this.permissions.has(Permission.canModifyAnyVisit));

    private todayDawn = DateUtil.truncateToDay(DateUtil.now()).toISOString();
    private tomorrowDawn = this.getTomorrowDawn();

    protected isFillButtonNeeded(visit: Visit): boolean {
        const userParticipant = visit.participants.some(p => p.id === this.permissions.personId);
        const userHasPermissionToFill = this.userCanModifyAnyVisit() || (userParticipant && this.userCanModifyVisit());

        const visitInRightStatus = ([VisitStatuses.SCHEDULED, VisitStatuses.STARTED] as Array<VisitStatus>).includes(visit.status);

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
