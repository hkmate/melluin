import {Component, computed, effect, input, model, signal} from '@angular/core';
import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {exportCSV} from '@fe/app/util/csv-export';
import {ChartComponent} from '@fe/app/util/chart/chart.component';

@Component({
    selector: 'app-statistics-widget',
    templateUrl: './statistics-widget.component.html',
    styleUrl: './statistics-widget.component.scss',
    host: {style: 'display: block'}
})
export class StatisticsWidgetComponent<T> {

    public readonly widgetId = input.required<string>();
    public readonly controller = input.required<StatisticWidgetController<T>>();

    protected readonly mode = model<'chart' | 'table'>('chart');
    protected readonly dataReady = computed(() => this.controller().hasData()());
    protected readonly title = computed(() => this.controller().getName());

    protected chartData = signal(ChartComponent.emptyChartConfig);
    protected tableData = computed(() => this.controller().getTableData());

    constructor() {
        effect(() => {
            if (this.dataReady()) {
                this.chartData.set(this.controller().getChartData());
            }
        }, {allowSignalWrites: true});
    }

    protected exportData(): void {
        const {data, fileName, headers} = this.controller().getExportingInfo();
        exportCSV(fileName, headers, data);
    }

}
