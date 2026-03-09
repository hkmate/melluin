import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {WidgetExportingInfo, WidgetTableData} from '@fe/app/statistics/model/widget-data';
import {ChartConfiguration} from 'chart.js';
import {Signal, signal} from '@angular/core';
import {OperationCity} from '@melluin/common';
import {WidgetMode} from '@fe/app/statistics/model/widget-mode';
import {t} from '@fe/app/util/translate/translate';
import {I18nKeys} from '@fe/app/util/translate/i18n.type';

export abstract class AbstractStatisticWidgetController<T> implements StatisticWidgetController<T> {

    private readonly dataInstance = signal<Array<T>>([]);
    private readonly ready = signal(false);

    protected constructor(protected readonly i18nPrefix: string) {
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
            fileName: t(`${this.i18nPrefix}.ExportedFileName` as I18nKeys)
        }
    }

    public getName(): string {
        return t(`${this.i18nPrefix}.Title` as I18nKeys);
    }

    public abstract getChartData(): ChartConfiguration;

    public abstract getTableData(): WidgetTableData<T>;

    protected abstract loadData(from: string, to: string, city: OperationCity): Promise<Array<T>>;

}
