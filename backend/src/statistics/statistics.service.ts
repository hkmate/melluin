import {Injectable} from '@nestjs/common';
import {StatisticsDao} from '@be/statistics/statistics.dao';
import {OperationCity} from '@shared/person/operation-city';
import {VisitByDepartments} from '@shared/statistics/visit-by-departments';
import {ChildrenByDepartments} from '@shared/statistics/children-by-departments';
import {VolunteerByDepartments} from '@shared/statistics/volunteer-by-departments';
import {ActivitiesCount} from '@shared/statistics/activities-count';
import {VisitStatusCount} from '@shared/statistics/visit-status-count';
import {ChildAgesByDepartments} from '@shared/statistics/child-ages-by-departments';
import {mapToActivitiesCount} from '@be/statistics/model/activities-count-row-item';
import {mapToVisitByDepartments} from '@be/statistics/model/visit-by-departments-row-item';
import {mapToChildrenByDepartments} from '@be/statistics/model/children-by-departments-row-item';
import {mapToVisitStatusCount} from '@be/statistics/model/visit-status-count-row-item';
import {mapToVolunteerByDepartments} from '@be/statistics/model/volunteer-by-departments-row-item';
import {mapToChildAgesByDepartments} from '@be/statistics/model/child-ages-by-departments-row-item';

@Injectable()
export class StatisticsService {

    constructor(private readonly statisticsDao: StatisticsDao) {
    }

    public async getVisitsByDepartments(from: string, to: string, city: OperationCity): Promise<Array<VisitByDepartments>> {
        const rawArray = await this.statisticsDao.getVisitsByDepartments(from, to, city);
        return rawArray.map(mapToVisitByDepartments);
    }

    public async getChildrenByDepartments(from: string, to: string, city: OperationCity): Promise<Array<ChildrenByDepartments>> {
        const rawArray = await this.statisticsDao.getChildrenByDepartments(from, to, city);
        return rawArray.map(mapToChildrenByDepartments);
    }

    public async getVisitsByStatuses(from: string, to: string, city: OperationCity): Promise<Array<VisitStatusCount>> {
        const rawArray = await this.statisticsDao.getVisitsByStatuses(from, to, city);
        return rawArray.map(mapToVisitStatusCount);
    }

    public async getVolunteersByDepartments(from: string, to: string, city: OperationCity): Promise<Array<VolunteerByDepartments>> {
        const rawArray = await this.statisticsDao.getVolunteersByDepartments(from, to, city);
        return rawArray.map(mapToVolunteerByDepartments);
    }

    public async getActivities(from: string, to: string, city: OperationCity): Promise<Array<ActivitiesCount>> {
        const rawArray = await this.statisticsDao.getActivities(from, to, city);
        return rawArray.map(mapToActivitiesCount);
    }

    public async getChildAgesByDepartments(from: string, to: string, city: OperationCity): Promise<Array<ChildAgesByDepartments>> {
        const rawArray = await this.statisticsDao.getChildAgesByDepartments(from, to, city);
        return rawArray.map(mapToChildAgesByDepartments);
    }

}
