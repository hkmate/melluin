import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';

export interface StatisticWidgetController {

    getChartData(): Promise<ChartConfiguration>;

    getTableData(): Promise<WidgetTableData>;

    getName(): string;

    getExportingInfo(): WidgetExportingInfo;

}
