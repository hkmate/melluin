import {ChangeDetectionStrategy, Component, computed, effect, input, linkedSignal, signal} from '@angular/core';
import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {exportCSV} from '@fe/app/util/csv-export';
import {ChartComponent} from '@fe/app/util/chart/chart.component';
import {WidgetMode, WidgetModes} from '@fe/app/statistics/model/widget-mode';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {StatisticWidgetTableComponent} from '@fe/app/statistics/statistics-widget/statistic-widget-table/statistic-widget-table.component';

@Component({
    imports: [
        MatCard,
        MatCardHeader,
        MatButtonToggleGroup,
        MatButtonToggle,
        FormsModule,
        TranslatePipe,
        MatButton,
        MatIcon,
        MatCardContent,
        ChartComponent,
        StatisticWidgetTableComponent
    ],
    selector: 'app-statistics-widget',
    templateUrl: './statistics-widget.component.html',
    styleUrl: './statistics-widget.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {style: 'display: block'}
})
export class StatisticsWidgetComponent<T> {

    WidgetModes = WidgetModes;

    public readonly widgetId = input.required<string>();
    public readonly controller = input.required<StatisticWidgetController<T>>();

    protected readonly mode = linkedSignal<WidgetMode>(() => this.controller().defaultMode());
    protected readonly dataReady = computed(() => this.controller().hasData()());
    protected readonly title = computed(() => this.controller().getName());

    protected chartData = signal(ChartComponent.emptyChartConfig);
    protected tableData = computed(() => this.controller().getTableData());

    constructor() {
        effect(() => {
            if (this.dataReady()) {
                this.chartData.set(this.controller().getChartData());
            }
        });
    }

    protected exportData(): void {
        const {data, fileName, headers} = this.controller().getExportingInfo();
        exportCSV(fileName, headers, data);
    }

}
