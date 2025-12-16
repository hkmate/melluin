import {Component, input, signal} from '@angular/core';
import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {exportCSV} from '@fe/app/util/csv-export';
import {ChartConfiguration} from 'chart.js';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {isNil} from '@shared/util/util';

@Component({
    selector: 'app-statistics-widget',
    templateUrl: './statistics-widget.component.html',
    styleUrl: './statistics-widget.component.scss'
})
export class StatisticsWidgetComponent {

    public readonly widgetId = input.required<string>();
    public readonly controller = input.required<StatisticWidgetController>();

    protected readonly mode = signal<'chart' | 'table'>('chart');

    protected chartData: ChartConfiguration;
    protected tableData: WidgetTableData;

    protected async switchToChart(): Promise<void> {
        this.mode.set('chart');
        if (isNil(this.chartData)) {
            this.chartData = await this.controller().getChartData();
        }
    }

    protected async switchToTable(): Promise<void> {
        this.mode.set('table');
        if (isNil(this.tableData)) {
            this.tableData = await this.controller().getTableData();
        }
    }

    protected exportData(): void {
        const {data, fileName, headers} = this.controller().getExportingInfo();
        exportCSV(fileName, headers, data);
    }

}
