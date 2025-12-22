import {afterNextRender, Component, computed, input, viewChild} from '@angular/core';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
    selector: 'app-statistic-widget-table',
    templateUrl: './statistic-widget-table.component.html',
    styleUrl: './statistic-widget-table.component.scss',
    host: {style: 'display: block; overflow-x: auto'},
})
export class StatisticWidgetTableComponent<T> {

    public readonly data = input.required<WidgetTableData<T>>();

    protected readonly columns = computed(() => Object.keys(this.data().headers))
    protected readonly dataSource = computed(() => new MatTableDataSource(this.data().data));
    private readonly sort = viewChild.required(MatSort);

    constructor() {
        afterNextRender(() => {
            this.dataSource().sort = this.sort();
        })
    }

}
