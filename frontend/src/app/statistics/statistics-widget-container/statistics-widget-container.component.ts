import {ChangeDetectionStrategy, Component, effect, inject, input} from '@angular/core';
import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {StatisticsService} from '@fe/app/statistics/statistics.service';
import {TranslateService} from '@ngx-translate/core';
import {StatFilter} from '@fe/app/statistics/model/stat-filter';
import {ActivitiesStatController} from '@fe/app/statistics/controller/activities-stat-controller';
import {ChildAgesByDepartmentsStatController} from '@fe/app/statistics/controller/child-ages-by-departments-stat-controller';

@Component({
    selector: 'app-statistics-widget-container',
    templateUrl: './statistics-widget-container.component.html',
    styleUrl: './statistics-widget-container.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsWidgetContainerComponent {

    private readonly translateService = inject(TranslateService);
    private readonly service = inject(StatisticsService);

    public readonly filter = input.required<StatFilter>();

    protected readonly controllers = this.createControllers();

    constructor() {
        effect(() => {
            const {from, to, city} = this.filter();
            this.controllers.forEach(controller => controller.load(from, to, city));
        });
    }

    private createControllers(): Array<StatisticWidgetController<unknown>> {
        return [
            new ActivitiesStatController(this.translateService, this.service),
            new ChildAgesByDepartmentsStatController(this.translateService, this.service)
        ];
    }

}
