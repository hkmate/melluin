import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {Signal} from '@angular/core';
import {OperationCity} from '@shared/person/operation-city';

export interface StatisticWidgetController<T> {

    load(from: string, to: string, city: OperationCity): Promise<void>;

    hasData(): Signal<boolean>;

    getChartData(): ChartConfiguration;

    getTableData(): WidgetTableData<T>;

    getName(): string;

    getExportingInfo(): WidgetExportingInfo<T>;

}
