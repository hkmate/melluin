import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {TranslateService} from '@ngx-translate/core';
import {StatisticsService} from '@fe/app/statistics/statistics.service';
import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {ChildAgesByDepartments} from '@shared/statistics/child-ages-by-departments';
import {computed, Signal, signal} from '@angular/core';
import {isNotNil} from '@shared/util/util';
import {OperationCity} from '@shared/person/operation-city';
import {firstValueFrom} from 'rxjs';

export type ChildAgesTableData = Omit<ChildAgesByDepartments, 'departmentId' | 'departmentName'>;

export class ChildAgesStatController implements StatisticWidgetController<ChildAgesTableData> {

    protected readonly data = signal<Array<ChildAgesTableData> | null>(null);
    private readonly ready = computed(() => isNotNil(this.data()));

    constructor(private readonly translate: TranslateService, private readonly statisticsService: StatisticsService) {
    }

    public hasData(): Signal<boolean> {
        return this.ready;
    }

    public async load(from: string, to: string, city: OperationCity): Promise<void> {
        const data = await firstValueFrom(this.statisticsService.getChildAgesByDepartmentsStat(from, to, city));
        this.data.set(this.prepareData(data));
    }

    public getChartData(): ChartConfiguration {
        return {
            type: 'bar',
            data: {
                // datasets: this.data() ?? []
            }
        } as ChartConfiguration;
    }

    public getExportingInfo(): WidgetExportingInfo<ChildAgesTableData> {
        return {
            ...this.getTableData(),
            fileName: this.translate.instant('StatisticsPage.ChildAges.ExportedFileName')
        }
    }

    public getName(): string {
        return this.translate.instant('StatisticsPage.ChildAges.Title');
    }

    // eslint-disable-next-line max-lines-per-function
    public getTableData(): WidgetTableData<ChildAgesTableData> {
        return {
            headers: {
                sum: this.translate.instant('StatisticsPage.ChildAges.Sum'),
                zeroToHalf: this.translate.instant('StatisticsPage.ChildAges.ZeroToHalf'),
                halfToOne: this.translate.instant('StatisticsPage.ChildAges.HalfToOne'),
                oneToThree: this.translate.instant('StatisticsPage.ChildAges.OneToThree'),
                threeToFive: this.translate.instant('StatisticsPage.ChildAges.ThreeToFive'),
                fiveToSeven: this.translate.instant('StatisticsPage.ChildAges.FiveToSeven'),
                sevenToNine: this.translate.instant('StatisticsPage.ChildAges.SevenToNine'),
                nineToEleven: this.translate.instant('StatisticsPage.ChildAges.NineToEleven'),
                elevenToThirteen: this.translate.instant('StatisticsPage.ChildAges.ElevenToThirteen'),
                thirteenToFifteen: this.translate.instant('StatisticsPage.ChildAges.ThirteenToFifteen'),
                fifteenToSeventeen: this.translate.instant('StatisticsPage.ChildAges.FifteenToSeventeen'),
                seventeenToUp: this.translate.instant('StatisticsPage.ChildAges.SeventeenToUp'),
            },
            data: this.data() ?? []
        }
    }

    private prepareData(original: Array<ChildAgesByDepartments>): Array<ChildAgesTableData> {
        const summed = original.reduce((sum, current) => {
            Object.keys(sum).forEach(key => {
                sum[key] += current[key];
            });
            return sum;
        }, this.getZeroItem());
        return [summed];
    }

    // eslint-disable-next-line max-lines-per-function
    private getZeroItem(): ChildAgesTableData {
        return {
            sum: 0,
            zeroToHalf: 0,
            halfToOne: 0,
            oneToThree: 0,
            threeToFive: 0,
            fiveToSeven: 0,
            sevenToNine: 0,
            nineToEleven: 0,
            elevenToThirteen: 0,
            thirteenToFifteen: 0,
            fifteenToSeventeen: 0,
            seventeenToUp: 0
        };
    }

}
