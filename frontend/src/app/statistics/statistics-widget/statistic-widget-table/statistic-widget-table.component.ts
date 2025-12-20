import {Component, computed, input} from '@angular/core';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';

@Component({
    selector: 'app-statistic-widget-table',
    templateUrl: './statistic-widget-table.component.html',
    styleUrl: './statistic-widget-table.component.scss',
    host: {style: 'display: block; overflow-x: auto'},
})
export class StatisticWidgetTableComponent<T> {

    public readonly data = input.required<WidgetTableData<T>>();

    protected readonly columns = computed(() => Object.keys(this.data().headers))

}
