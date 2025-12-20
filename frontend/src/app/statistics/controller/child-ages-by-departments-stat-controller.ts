import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {TranslateService} from '@ngx-translate/core';
import {StatisticsService} from '@fe/app/statistics/statistics.service';
import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {computed, Signal, signal} from '@angular/core';
import {isNotNil} from '@shared/util/util';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';
import {ChildAgesByDepartments} from '@shared/statistics/child-ages-by-departments';


export type ChildAgesByDepartmentsTableData = Omit<ChildAgesByDepartments, 'departmentId'>;

export class ChildAgesByDepartmentsStatController implements StatisticWidgetController<ChildAgesByDepartmentsTableData> {

    protected readonly data = signal<Array<ChildAgesByDepartmentsTableData> | null>(null);
    private readonly ready = computed(() => isNotNil(this.data()));

    constructor(private readonly translate: TranslateService, private readonly statisticsService: StatisticsService) {
    }

    public hasData(): Signal<boolean> {
        return this.ready;
    }

    public async load(from: string, to: string, city: OperationCity): Promise<void> {
        const data = await firstValueFrom(this.statisticsService.getChildAgesByDepartmentsStat(from, to, city));
        this.data.set(data);
    }

    public getChartData(): ChartConfiguration {
        return {
            type: 'bar',
            data: {
                // datasets: this.data() ?? []
            }
        } as ChartConfiguration;
    }

    public getExportingInfo(): WidgetExportingInfo<ChildAgesByDepartmentsTableData> {
        return {
            ...this.getTableData(),
            fileName: this.translate.instant('StatisticsPage.ChildAgesByDepartments.ExportedFileName')
        }
    }

    public getName(): string {
        return this.translate.instant('StatisticsPage.ChildAgesByDepartments.Title');
    }

    // eslint-disable-next-line max-lines-per-function
    public getTableData(): WidgetTableData<ChildAgesByDepartmentsTableData> {
        return {
            headers: {
                departmentName: this.translate.instant('StatisticsPage.ChildAgesByDepartments.departmentName'),
                sum: this.translate.instant('StatisticsPage.ChildAgesByDepartments.sum'),
                zeroToHalf: this.translate.instant('StatisticsPage.ChildAgesByDepartments.zeroToHalf'),
                halfToOne: this.translate.instant('StatisticsPage.ChildAgesByDepartments.halfToOne'),
                oneToThree: this.translate.instant('StatisticsPage.ChildAgesByDepartments.oneToThree'),
                threeToFive: this.translate.instant('StatisticsPage.ChildAgesByDepartments.threeToFive'),
                fiveToSeven: this.translate.instant('StatisticsPage.ChildAgesByDepartments.fiveToSeven'),
                sevenToNine: this.translate.instant('StatisticsPage.ChildAgesByDepartments.sevenToNine'),
                nineToEleven: this.translate.instant('StatisticsPage.ChildAgesByDepartments.nineToEleven'),
                elevenToThirteen: this.translate.instant('StatisticsPage.ChildAgesByDepartments.elevenToThirteen'),
                thirteenToFifteen: this.translate.instant('StatisticsPage.ChildAgesByDepartments.thirteenToFifteen'),
                fifteenToSeventeen: this.translate.instant('StatisticsPage.ChildAgesByDepartments.fifteenToSeventeen'),
                seventeenToUp: this.translate.instant('StatisticsPage.ChildAgesByDepartments.seventeenToUp')
            },
            data: this.data() ?? []
        }
    }

}
