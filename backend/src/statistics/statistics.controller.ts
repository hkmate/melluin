import {BadRequestException, Controller, Get, Query} from '@nestjs/common';
import {StatisticsService} from '@be/statistics/statistics.service';
import {isNotNil} from '@shared/util/util';
import {OperationCity} from '@shared/person/operation-city';
import {VisitByDepartments} from '@shared/statistics/visit-by-departments';
import {PermissionGuard} from '@be/auth/decorator/permissions.decorator';
import {Permission} from '@shared/user/permission.enum';
import {ChildrenByDepartments} from '@shared/statistics/children-by-departments';
import {VolunteerByDepartments} from '@shared/statistics/volunteer-by-departments';
import {ActivitiesCount} from '@shared/statistics/activities-count';
import {VisitStatusCount} from '@shared/statistics/visit-status-count';
import {ChildAgesByDepartments} from '@shared/statistics/child-ages-by-departments';
import {VisitsCountByWeekDay} from '@shared/statistics/visits-count-by-week-day';


@Controller('statistics')
export class StatisticsController {

    constructor(private readonly statisticsService: StatisticsService) {
    }

    @Get('/visits-count-by-week-day')
    @PermissionGuard(Permission.canReadStatistics)
    public getVisitsCountStat(@Query('from') fromDateTime: string,
                              @Query('to') toDateTime: string,
                              @Query('city') city: string): Promise<Array<VisitsCountByWeekDay>> {
        this.verifyStatisticsParams(fromDateTime, toDateTime, city);

        return this.statisticsService.getVisitsCountByWeekDay(fromDateTime, toDateTime, city);
    }

    @Get('/visits-by-departments')
    @PermissionGuard(Permission.canReadStatistics)
    public getVisitsByDepartmentsStat(@Query('from') fromDateTime: string,
                                      @Query('to') toDateTime: string,
                                      @Query('city') city: string): Promise<Array<VisitByDepartments>> {
        this.verifyStatisticsParams(fromDateTime, toDateTime, city);

        return this.statisticsService.getVisitsByDepartments(fromDateTime, toDateTime, city);
    }

    @Get('/children-by-departments')
    @PermissionGuard(Permission.canReadStatistics)
    public getChildrenByDepartmentsStat(@Query('from') fromDateTime: string,
                                        @Query('to') toDateTime: string,
                                        @Query('city') city: string): Promise<Array<ChildrenByDepartments>> {
        this.verifyStatisticsParams(fromDateTime, toDateTime, city);

        return this.statisticsService.getChildrenByDepartments(fromDateTime, toDateTime, city);
    }

    @Get('/visits-by-statuses')
    @PermissionGuard(Permission.canReadStatistics)
    public getVisitsByStatusesStat(@Query('from') fromDateTime: string,
                                   @Query('to') toDateTime: string,
                                   @Query('city') city: string): Promise<Array<VisitStatusCount>> {
        this.verifyStatisticsParams(fromDateTime, toDateTime, city);

        return this.statisticsService.getVisitsByStatuses(fromDateTime, toDateTime, city);
    }

    @Get('/volunteer-by-departments')
    @PermissionGuard(Permission.canReadStatistics)
    public getVolunteersByDepartmentsStat(@Query('from') fromDateTime: string,
                                          @Query('to') toDateTime: string,
                                          @Query('city') city: string): Promise<Array<VolunteerByDepartments>> {
        this.verifyStatisticsParams(fromDateTime, toDateTime, city);

        return this.statisticsService.getVolunteersByDepartments(fromDateTime, toDateTime, city);
    }

    @Get('/activities')
    @PermissionGuard(Permission.canReadStatistics)
    public getActivities(@Query('from') fromDateTime: string,
                         @Query('to') toDateTime: string,
                         @Query('city') city: string): Promise<Array<ActivitiesCount>> {
        this.verifyStatisticsParams(fromDateTime, toDateTime, city);

        return this.statisticsService.getActivities(fromDateTime, toDateTime, city);
    }

    @Get('/child-ages-by-departments')
    @PermissionGuard(Permission.canReadStatistics)
    public getChildAgesByDepartmentsStats(@Query('from') fromDateTime: string,
                                          @Query('to') toDateTime: string,
                                          @Query('city') city: string): Promise<Array<ChildAgesByDepartments>> {
        this.verifyStatisticsParams(fromDateTime, toDateTime, city);

        return this.statisticsService.getChildAgesByDepartments(fromDateTime, toDateTime, city);
    }


    private verifyStatisticsParams(from: string, to: string, city: string): asserts city is OperationCity {
        this.verifyIsDateString(from);
        this.verifyIsDateString(to);
        this.verifyTimeInterval(from, to);
        this.verifyCityIsValid(city);
    }

    private verifyIsDateString(dateString: string): void | never {
        const timestamp = Date.parse(dateString);
        if (!isNaN(timestamp)) {
            return;
        }
        throw new BadRequestException('Invalid date: ' + dateString);
    }

    private verifyTimeInterval(from: string, to: string): void | never {
        if (Date.parse(from) <= Date.parse(to)) {
            return;
        }
        throw new BadRequestException(`Invalid time interval: ${from} - ${to}`);
    }

    private verifyCityIsValid(city: string): asserts city is OperationCity {
        if (isNotNil(OperationCity[city])) {
            return;
        }
        throw new BadRequestException(`Unknown city: ${city}`);
    }

}
