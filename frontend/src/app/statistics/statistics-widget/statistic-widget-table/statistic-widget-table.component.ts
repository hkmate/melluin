import {Component, computed, input} from '@angular/core';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';

@Component({
    selector: 'app-statistic-widget-table',
    templateUrl: './statistic-widget-table.component.html',
    styleUrl: './statistic-widget-table.component.scss'
})
export class StatisticWidgetTableComponent {

    public readonly data = input.required<WidgetTableData>();

    protected readonly columns = computed(() => Object.keys(this.data().headers))

}
