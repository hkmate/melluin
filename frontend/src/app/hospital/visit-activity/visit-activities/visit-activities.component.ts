import {Component, Input, OnInit} from '@angular/core';
import {VisitActivityService} from '@fe/app/hospital/visit-activity/visit-activity.service';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {DepartmentBoxStatus} from '@shared/department/box/department-box-status';
import {PatientChild, PatientChildId} from '@shared/child/patient-child';
import {WrappedHospitalVisitActivity} from '@shared/hospital-visit-activity/wrapped-hospital-visit-activity';
import {isNil, isNotNil} from '@shared/util/util';
import {firstValueFrom} from 'rxjs';
import {Permission} from '@shared/user/permission.enum';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {VisitTempDataService} from '@fe/app/hospital/visit-activity/visit-temp-data.service';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {ChildService} from '@fe/app/hospital/child/child.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-visit-activities',
    templateUrl: './visit-activities.component.html',
    styleUrls: ['./visit-activities.component.scss']
})
export class VisitActivitiesComponent implements OnInit {

    private static readonly CHILDREN_TMP_DATA_KEY = 'children';

    Permission = Permission;

    @Input()
    public visit: HospitalVisit;

    @Input()
    public wrappedActivities?: WrappedHospitalVisitActivity;

    @Input()
    public editEnabled = false;

    protected children: Array<PatientChild> = [];
    protected activities: Array<HospitalVisitActivity> = [];
    protected visitDate: Date;
    protected boxInfoList: Array<DepartmentBoxStatus> = [];

    constructor(protected readonly permissions: PermissionService,
                private readonly tempDataService: VisitTempDataService,
                private readonly boxService: DepartmentBoxService,
                private readonly childService: ChildService,
                private readonly activityService: VisitActivityService) {
    }

    public ngOnInit(): void {
        this.visitDate = new Date(this.visit.dateTimeFrom);
        this.setupBoxInfo().then();
        this.setupActivities().then(() => {
            this.addChildrenFromTmp().then();
        });
    }

    protected boxStatusAdded(newBoxStatus: DepartmentBoxStatus): void {
        this.boxInfoList.push(newBoxStatus);
    }

    protected childrenListChanged(children: Array<PatientChild>): void {
        this.children = [...children];
        this.tempDataService.set(this.visit.id, VisitActivitiesComponent.CHILDREN_TMP_DATA_KEY,
            {
                value: this.children.map(patientChild => ({
                    childId: patientChild.child.id,
                    isParentThere: patientChild.isParentThere
                }))
            }
        ).subscribe();
    }

    private async setupActivities(): Promise<void> {
        const wrapped = await this.getWrappedActivities();
        if (isNil(wrapped)) {
            return;
        }
        this.children = this.createPatientInfo(wrapped);
        this.activities = wrapped.activities;
    }

    private getWrappedActivities(): Promise<WrappedHospitalVisitActivity> {
        if (isNotNil(this.wrappedActivities)) {
            return Promise.resolve(this.wrappedActivities);
        }
        return firstValueFrom(this.activityService.getActivities(this.visit.id));
    }

    private createPatientInfo(activityInfo: WrappedHospitalVisitActivity): Array<PatientChild> {
        const childrenById = activityInfo.children.reduce<Record<string, PatientChild>>((result, child) => {
            result[child.id] = {child};
            return result;
        }, {});
        activityInfo.activities.forEach(activityInfo =>
            activityInfo.children.forEach(child => {
                childrenById[child.childId].isParentThere = child.isParentThere;
            }));
        return Object.values(childrenById);
    }

    private setupBoxInfo(): Promise<void> {
        return firstValueFrom(this.boxService.findBoxStatusesByVisit(this.visit.id)).then(boxInfo => {
            this.boxInfoList = boxInfo
        });
    }

    private async addChildrenFromTmp(): Promise<void> {
        const tmpPatientChildIds = await this.getChildrenIdsFromTemp();
        const localChildrenIds = this.children.map(c => c.child.id);
        const tmpChildrenIds = tmpPatientChildIds.map(t => t.childId);
        const neededChildrenIds = _.differenceBy(tmpChildrenIds, localChildrenIds);
        const children = await Promise.all(neededChildrenIds.map(childId => firstValueFrom(this.childService.get(childId))));
        const missedPatientChildren = children.map(child => ({
            child,
            isParentThere: tmpPatientChildIds.find(c => c.childId === child.id)?.isParentThere
        }));
        this.children = this.children.concat(missedPatientChildren);
    }

    private getChildrenIdsFromTemp(): Promise<Array<PatientChildId>> {
        return firstValueFrom(this.tempDataService.getTempData(this.visit.id)).then(tmp => {
            const childrenRawList = tmp[VisitActivitiesComponent.CHILDREN_TMP_DATA_KEY] ?? [];
            return childrenRawList as Array<PatientChildId>;
        });
    }

}
