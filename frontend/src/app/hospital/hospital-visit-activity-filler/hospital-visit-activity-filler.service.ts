import {Injectable} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {Child, ChildAge} from '@shared/child/child';
import {getMonthsSince, MONTHS_IN_YEAR} from '@shared/child/child-age-calculator';
import {VisitedChild, VisitedChildEditInput, VisitedChildInput} from '@shared/hospital-visit/visited-child';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {DateUtil} from '@shared/util/date-util';
import {BehaviorSubject, map, Observable, switchMap, tap} from 'rxjs';
import {MessageService} from '@fe/app/util/message.service';
import {VisitedChildService} from '@fe/app/hospital/child/visited-child.service';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {VisitedChildById} from '@fe/app/hospital/hospital-visit-activity-filler/model/visited-child-by-id';
import {
    HospitalVisitActivityEditInput,
    HospitalVisitActivityInput
} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import * as _ from 'lodash';

@Injectable()
export class HospitalVisitActivityFillerService {

    private visitDate: Date;
    private visit: HospitalVisit;
    private children$: BehaviorSubject<Array<VisitedChild>>;
    private lockedChildIds$: BehaviorSubject<Array<string>>;
    private activities$: BehaviorSubject<Array<HospitalVisitActivity>>;
    private visitStatus$: BehaviorSubject<HospitalVisitStatus>;

    constructor(private readonly msg: MessageService,
                private readonly visitedChildService: VisitedChildService,
                private readonly activityService: VisitActivityService) {
    }

    public startFilling(visit: HospitalVisit): void {
        this.visit = visit;
        this.visitDate = DateUtil.parse(visit.dateTimeFrom);
        this.children$ = new BehaviorSubject<Array<VisitedChild>>([]);
        this.lockedChildIds$ = new BehaviorSubject<Array<string>>([]);
        this.activities$ = new BehaviorSubject<Array<HospitalVisitActivity>>([]);
        this.visitStatus$ = new BehaviorSubject<HospitalVisitStatus>(this.visit.status);
        this.activityService.getActivities(this.visit.id).subscribe({
            next: wrappedVisit => {
                this.children$.next(wrappedVisit.children);
                this.activities$.next(wrappedVisit.activities);
            }
        });
    }

    public statusChanged(newStatus: HospitalVisitStatus): void {
        this.visitStatus$.next(newStatus);
    }

    public getChildren(): Observable<Array<VisitedChild>> {
        return this.children$.asObservable();
    }

    public getActivities(): Observable<Array<HospitalVisitActivity>> {
        return this.activities$.asObservable();
    }

    public getVisitDate(): Date {
        return new Date(this.visitDate);
    }

    public childAge(child: Child): ChildAge {
        const monthAge = getMonthsSince(child.guessedBirth, this.visitDate);
        return {
            years: Math.floor(monthAge / MONTHS_IN_YEAR),
            months: monthAge % MONTHS_IN_YEAR
        }
    }

    public lockVisitedChildId(...visitedChildIds: Array<string>): void {
        this.lockedChildIds$.next([...visitedChildIds, ...this.lockedChildIds$.getValue()]);
    }

    public unlockVisitedChildId(...visitedChildIds: Array<string>): void {
        this.lockedChildIds$.next(_.difference(this.lockedChildIds$.getValue(), visitedChildIds));
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

    public saveNewActivity(newActivity: HospitalVisitActivityInput): Observable<HospitalVisitActivity> {
        return this.activityService.add(this.visit.id, newActivity).pipe(
            tap({
                next: (activity: HospitalVisitActivity) => {
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

    public updateActivity(activityEdit: HospitalVisitActivityEditInput): Observable<HospitalVisitActivity> {
        return this.activityService.update(this.visit.id, activityEdit.id, activityEdit).pipe(
            tap({
                next: (activity: HospitalVisitActivity) => {
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

    public removeActivity(activity: HospitalVisitActivity): Observable<void> {
        return this.activityService.delete(this.visit.id, activity.id).pipe(
            tap({
                next: () => {
                    this.msg.success('DeleteSuccessful');
                    this.activities$.next(this.activities$.getValue().filter(a => a.id !== activity.id));
                }
            }));
    }

    public convertToChildrenById(children: Array<VisitedChild>): VisitedChildById {
        return children.reduce<VisitedChildById>(
            (result, visitedChild) => {
                result[visitedChild.id] = visitedChild;
                return result;
            }, {});
    }

    private isStarted(status: HospitalVisitStatus): boolean {
        return HospitalVisitStatus.STARTED === status;
    }

}
