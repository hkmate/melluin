import {Injectable} from '@nestjs/common';
import {StatisticsDao} from '@be/statistics/statistics.dao';
import {OperationCity} from '@shared/person/operation-city';
import {VisitByDepartments} from '@shared/statistics/visit-by-departments';
import {ChildrenByDepartments} from '@shared/statistics/children-by-departments';
import {VolunteerByDepartments} from '@shared/statistics/volunteer-by-departments';
import {ActivitiesCount} from '@shared/statistics/activities-count';
import {VisitStatusCount} from '@shared/statistics/visit-status-count';
import {ChildAgesByDepartments} from '@shared/statistics/child-ages-by-departments';
import {camelizeKeys} from '@be/util/camelize-keys';
import {VisitsCountByWeekDay} from '@shared/statistics/visits-count-by-week-day';

@Injectable()
export class StatisticsService {

    constructor(private readonly statisticsDao: StatisticsDao) {
    }

    public async getVisitsCountByWeekDay(from: string, to: string, city: OperationCity): Promise<Array<VisitsCountByWeekDay>> {
        const rawArray = await this.statisticsDao.getVisitsByWeekDay(from, to, city);
        return rawArray.map(camelizeKeys);
    }

    public async getVisitsByDepartments(from: string, to: string, city: OperationCity): Promise<Array<VisitByDepartments>> {
        const rawArray = await this.statisticsDao.getVisitsByDepartments(from, to, city);
        return rawArray.map(camelizeKeys);
    }

    public async getChildrenByDepartments(from: string, to: string, city: OperationCity): Promise<Array<ChildrenByDepartments>> {
        const rawArray = await this.statisticsDao.getChildrenByDepartments(from, to, city);
        return rawArray.map(camelizeKeys);
    }

    public getVisitsByStatuses(from: string, to: string, city: OperationCity): Promise<Array<VisitStatusCount>> {
        return this.statisticsDao.getVisitsByStatuses(from, to, city);
    }

    public async getVolunteersByDepartments(from: string, to: string, city: OperationCity): Promise<Array<VolunteerByDepartments>> {
        const rawArray = await this.statisticsDao.getVolunteersByDepartments(from, to, city);
        return rawArray.map(camelizeKeys);
    }

    public getActivities(from: string, to: string, city: OperationCity): Promise<Array<ActivitiesCount>> {
        return this.statisticsDao.getActivities(from, to, city);
    }

    public async getChildAgesByDepartments(from: string, to: string, city: OperationCity): Promise<Array<ChildAgesByDepartments>> {
        const rawArray = await this.statisticsDao.getChildAgesByDepartments(from, to, city);
        return rawArray.map(camelizeKeys);
    }

}
