import {Injectable} from '@nestjs/common';
import {StatisticsDao} from '@be/statistics/statistics.dao';
import {
    ActivitiesCount,
    ChildAgesByDepartments,
    ChildrenByDepartments,
    OperationCity,
    VisitByDepartments,
    VisitsCountByWeekDay,
    VisitStatusCount,
    VolunteerByDepartments,
    VolunteersVisitCount
} from '@melluin/common';
import {camelizeKeys} from '@be/util/camelize-keys';

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

    public async getVolunteersVisitCount(from: string, to: string, city: OperationCity): Promise<Array<VolunteersVisitCount>> {
        const rawArray = await this.statisticsDao.getVolunteersVisitCount(from, to, city);
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
