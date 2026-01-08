import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {TranslateService} from '@ngx-translate/core';
import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {Signal, signal} from '@angular/core';
import {OperationCity} from '@shared/person/operation-city';
import {WidgetMode} from '@fe/app/statistics/model/widget-mode';

export abstract class AbstractStatisticWidgetController<T> implements StatisticWidgetController<T> {

    private readonly dataInstance = signal<Array<T>>([]);
    private readonly ready = signal(false);

    protected constructor(protected readonly translate: TranslateService, protected readonly i18nPrefix: string) {
    }

    protected get data(): Signal<Array<T>> {
        return this.dataInstance;
    }

    public hasData(): Signal<boolean> {
        return this.ready;
    }

    public defaultMode(): WidgetMode {
        return WidgetMode.CHART;
    }

    public async load(from: string, to: string, city: OperationCity): Promise<void> {
        const data = await this.loadData(from, to, city);
        this.dataInstance.set(data);
        this.ready.set(true);
    }

    public getExportingInfo(): WidgetExportingInfo<T> {
        return {
            ...this.getTableData(),
            fileName: this.translate.instant(`${this.i18nPrefix}.ExportedFileName`)
        }
    }

    public getName(): string {
        return this.translate.instant(`${this.i18nPrefix}.Title`);
    }

    public abstract getChartData(): ChartConfiguration;

    public abstract getTableData(): WidgetTableData<T>;

    protected abstract loadData(from: string, to: string, city: OperationCity): Promise<Array<T>>;

}
