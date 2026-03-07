import {inject, Injectable} from '@angular/core';
import {
    Child,
    ChildAge,
    DateUtil,
    getChildAge,
    Visit,
    VisitActivity,
    VisitActivityEditInput,
    VisitActivityInput,
    VisitStatus,
    VisitedChild,
    VisitedChildEditInput,
    VisitedChildInput
} from '@melluin/common';
import {BehaviorSubject, map, Observable, switchMap, tap} from 'rxjs';
import {MessageService} from '@fe/app/util/message.service';
import {VisitedChildService} from '@fe/app/hospital/child/visited-child.service';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';
import {difference} from 'lodash-es';

@Injectable()
export class VisitActivityFillerService {

    private readonly msg = inject(MessageService);
    private readonly visitedChildService = inject(VisitedChildService);
    private readonly activityService = inject(VisitActivityService);

    private visitDate: Date;
    private visit: Visit;
    private readonly children$ = new BehaviorSubject<Array<VisitedChild>>([]);
    private readonly lockedChildIds$ = new BehaviorSubject<Array<string>>([]);
    private readonly activities$ = new BehaviorSubject<Array<VisitActivity>>([])
    private readonly visitStatus$ = new BehaviorSubject<VisitStatus | null>(null);

    public startFilling(visit: Visit): void {
        this.visit = visit;
        this.visitDate = DateUtil.parse(visit.dateTimeFrom);
        this.children$.next([]);
        this.lockedChildIds$.next([]);
        this.activities$.next([]);
        this.visitStatus$.next(this.visit.status);
        this.activityService.getActivities(this.visit.id).subscribe({
            next: wrappedVisit => {
                this.children$.next(wrappedVisit.children);
                this.activities$.next(wrappedVisit.activities);
            }
        });
    }

    public statusChanged(newStatus: VisitStatus): void {
        this.visitStatus$.next(newStatus);
    }

    public getChildren(): Observable<Array<VisitedChild>> {
        return this.children$.asObservable();
    }

    public getActivities(): Observable<Array<VisitActivity>> {
        return this.activities$.asObservable();
    }

    public getVisitDate(): Date {
        return new Date(this.visitDate);
    }

    public childAge(child: Child): ChildAge {
        return getChildAge(child, this.visitDate);
    }

    public lockVisitedChildId(...visitedChildIds: Array<string>): void {
        this.lockedChildIds$.next([...visitedChildIds, ...this.lockedChildIds$.getValue()]);
    }

    public unlockVisitedChildId(...visitedChildIds: Array<string>): void {
        this.lockedChildIds$.next(difference(this.lockedChildIds$.getValue(), visitedChildIds));
    }

    public isChildCopyableToActualVisit(childId: string): Observable<boolean> {
        return this.children$.asObservable().pipe(
            map(children => children.every(c => c.child.id !== childId)),
            switchMap(childNotInList => this.visitStatus$.asObservable().pipe(
                map(newStatus => childNotInList && this.isStarted(newStatus)))
            )
        );
    }

    public isChildDeletable(childId: string): Observable<boolean> {
        return this.activities$.asObservable().pipe(
            map(activities => activities.every(activity => !activity.children.includes(childId))),
            switchMap((childIsNotInActivity: boolean) => this.lockedChildIds$.asObservable().pipe(
                map((lockedChildIds: Array<string>) => childIsNotInActivity && !lockedChildIds.includes(childId))
            ))
        );
    }

    public saveNewChild(newChild: VisitedChildInput): Observable<VisitedChild> {
        return this.visitedChildService.add(this.visit.id, newChild).pipe(
            tap({
                next: (visitedChild: VisitedChild) => {
                    this.msg.success('SaveSuccessful');
                    this.children$.next([visitedChild, ...this.children$.getValue()]);
                }
            }));
    }

    public saveNewActivity(newActivity: VisitActivityInput): Observable<VisitActivity> {
        return this.activityService.add(this.visit.id, newActivity).pipe(
            tap({
                next: (activity: VisitActivity) => {
                    this.msg.success('SaveSuccessful');
                    this.activities$.next([activity, ...this.activities$.getValue()]);
                }
            }));
    }

    public updateChild(childInput: VisitedChildEditInput): Observable<VisitedChild> {
        return this.visitedChildService.update(this.visit.id, childInput.id, childInput).pipe(
            tap({
                next: (visitedChild: VisitedChild) => {
                    this.msg.success('SaveSuccessful');
                    this.children$.next(this.children$.getValue().map(c => {
                        if (c.id === visitedChild.id) {
                            return visitedChild;
                        }
                        return c;
                    }));
                }
            }));
    }

    public updateActivity(activityEdit: VisitActivityEditInput): Observable<VisitActivity> {
        return this.activityService.update(this.visit.id, activityEdit.id, activityEdit).pipe(
            tap({
                next: (activity: VisitActivity) => {
                    this.msg.success('SaveSuccessful');
                    this.activities$.next(this.activities$.getValue().map(a => {
                        if (a.id === activity.id) {
                            return activity;
                        }
                        return a;
                    }));
                }
            }));
    }

    public removeChild(child: VisitedChild): Observable<void> {
        return this.visitedChildService.delete(this.visit.id, child.id).pipe(
            tap({
                next: () => {
                    this.msg.success('DeleteSuccessful');
                    this.children$.next(this.children$.getValue().filter(c => c.id !== child.id));
                }
            }));
    }

    public removeActivity(activity: VisitActivity): Observable<void> {
        return this.activityService.delete(this.visit.id, activity.id).pipe(
            tap({
                next: () => {
                    this.msg.success('DeleteSuccessful');
                    this.activities$.next(this.activities$.getValue().filter(a => a.id !== activity.id));
                }
            }));
    }

    private isStarted(status: VisitStatus | null): boolean {
        return VisitStatus.STARTED === status;
    }

}
