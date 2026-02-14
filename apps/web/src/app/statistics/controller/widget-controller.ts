import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {Signal} from '@angular/core';
import {OperationCity} from '@shared/person/operation-city';
import {WidgetMode} from '@fe/app/statistics/model/widget-mode';

export interface StatisticWidgetController<T> {

    load(from: string, to: string, city: OperationCity): Promise<void>;

    hasData(): Signal<boolean>;

    defaultMode(): WidgetMode;

    getChartData(): ChartConfiguration;

    getTableData(): WidgetTableData<T>;

    getName(): string;

    getExportingInfo(): WidgetExportingInfo<T>;

}
