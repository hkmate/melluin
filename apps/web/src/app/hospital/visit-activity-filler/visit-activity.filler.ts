import {computed, inject, linkedSignal, Signal, signal, WritableSignal} from '@angular/core';
import {
    Child,
    ChildAge,
    DateUtil,
    getChildAge,
    UUID,
    Visit,
    VisitActivity,
    VisitActivityEditInput,
    VisitActivityInput,
    VisitedChild,
    VisitedChildEditInput,
    VisitedChildInput,
    VisitStatus,
    VisitStatuses
} from '@melluin/common';
import {Observable, tap} from 'rxjs';
import {MessageService} from '@fe/app/util/message.service';
import {VisitedChildService} from '@fe/app/hospital/child/visited-child.service';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';
import {difference} from 'lodash-es';

export class VisitActivityFiller {

    private readonly msg = inject(MessageService);
    private readonly visitedChildService = inject(VisitedChildService);
    private readonly activityService = inject(VisitActivityService);

    private readonly visit: WritableSignal<Visit>;
    private readonly visitDate = computed(() => DateUtil.parse(this.visit().dateTimeFrom));
    private readonly visitStatus = linkedSignal(() => this.visit().status);
    private readonly children = signal<Array<VisitedChild>>([]);
    private readonly lockedChildIds = signal<Array<UUID>>([]);
    private readonly activities = signal<Array<VisitActivity>>([]);

    constructor(visit: Visit) {
        this.visit = signal(visit);
        this.activityService.getActivities(visit.id).subscribe(wrappedVisit => {
            this.children.set(wrappedVisit.children);
            this.activities.set(wrappedVisit.activities);
        });
    }

    public statusChanged(newStatus: VisitStatus): void {
        this.visitStatus.set(newStatus);
    }

    public getChildren(): Signal<Array<VisitedChild>> {
        return this.children.asReadonly();
    }

    public getActivities(): Signal<Array<VisitActivity>> {
        return this.activities.asReadonly();
    }

    public getVisitDate(): Signal<Date> {
        return this.visitDate;
    }

    public childAge(child: Child): ChildAge {
        return getChildAge(child, this.visitDate());
    }

    public lockVisitedChildId(...visitedChildIds: Array<UUID>): void {
        this.lockedChildIds.update(prev => [...visitedChildIds, ...prev]);
    }

    public unlockVisitedChildId(...visitedChildIds: Array<UUID>): void {
        this.lockedChildIds.update(prev => difference(prev, visitedChildIds));
    }

    public isChildCopyableToActualVisit(childId: string): Signal<boolean> {
        return computed(() => this.isStarted(this.visitStatus())
            && this.children().every(c => c.child.id !== childId));
    }

    public isChildDeletable(childId: UUID): Signal<boolean> {
        return computed(() => {
            const childIsNotInActivity = this.activities().every(activity => !activity.children.includes(childId))
            const childIsNotLocked = !this.lockedChildIds().includes(childId);
            return childIsNotInActivity && childIsNotLocked
        });
    }

    public saveNewChild(newChild: VisitedChildInput): Observable<VisitedChild> {
        return this.visitedChildService.add(this.visit().id, newChild).pipe(
            tap((visitedChild: VisitedChild) => {
                this.msg.success('SaveSuccessful');
                this.children.update(prev => [visitedChild, ...prev]);
            }));
    }

    public saveNewActivity(newActivity: VisitActivityInput): Observable<VisitActivity> {
        return this.activityService.add(this.visit().id, newActivity).pipe(
            tap((activity: VisitActivity) => {
                this.msg.success('SaveSuccessful');
                this.activities.update(prev => [activity, ...prev]);
            }));
    }

    public updateChild(childInput: VisitedChildEditInput): Observable<VisitedChild> {
        return this.visitedChildService.update(this.visit().id, childInput.id, childInput).pipe(
            tap((visitedChild: VisitedChild) => {
                this.msg.success('SaveSuccessful');
                this.children.update(prev => prev
                    .map(c  => ((c.id === visitedChild.id) ? visitedChild : c)));
            }));
    }

    public updateActivity(activityEdit: VisitActivityEditInput): Observable<VisitActivity> {
        return this.activityService.update(this.visit().id, activityEdit.id, activityEdit).pipe(
            tap((activity: VisitActivity) => {
                this.msg.success('SaveSuccessful');
                this.activities.update(prev => prev
                    .map(a  => ((a.id === activity.id) ? activity : a)));
            }));
    }

    public removeChild(child: VisitedChild): Observable<void> {
        return this.visitedChildService.delete(this.visit().id, child.id).pipe(
            tap(() => {
                this.msg.success('DeleteSuccessful');
                this.children.update(prev => prev.filter(c => c.id !== child.id));
            }));
    }

    public removeActivity(activity: VisitActivity): Observable<void> {
        return this.activityService.delete(this.visit().id, activity.id).pipe(
            tap(() => {
                this.msg.success('DeleteSuccessful');
                this.activities.update(prev => prev.filter(a => a.id !== activity.id));
            }));
    }

    private isStarted(status: VisitStatus | null): boolean {
        return VisitStatuses.STARTED === status;
    }

}
