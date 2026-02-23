import {afterNextRender, Component, computed, input, viewChild} from '@angular/core';
import {WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableDataSource
} from '@angular/material/table';

@Component({
    selector: 'app-statistic-widget-table',
    templateUrl: './statistic-widget-table.component.html',
    styleUrl: './statistic-widget-table.component.scss',
    host: {style: 'display: block; overflow-x: auto; max-height: 80dvh'},
    imports: [
        MatTable,
        MatSort,
        MatSortHeader,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderCellDef,
        MatCell,
        MatCellDef,
        MatHeaderRow,
        MatRow,
        MatRowDef,
        MatHeaderRowDef
    ]
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
