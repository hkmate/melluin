import {ChangeDetectionStrategy, Component, effect, inject, input} from '@angular/core';
import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';
import {StatisticsService} from '@fe/app/statistics/service/statistics.service';
import {TranslateService} from '@ngx-translate/core';
import {StatFilter} from '@fe/app/statistics/model/stat-filter';
import {ActivitiesStatController} from '@fe/app/statistics/controller/activities-stat-controller';
import {ChildAgesByDepartmentsStatController} from '@fe/app/statistics/controller/child-ages-by-departments-stat-controller';
import {VisitsByDepartmentsStatController} from '@fe/app/statistics/controller/visits-by-departments-stat-controller';
import {VisitsByStatusesStatController} from '@fe/app/statistics/controller/visits-by-statuses-stat-controller';
import {ChildrenByDepartmentsStatController} from '@fe/app/statistics/controller/children-by-departments-stat-controller';
import {ChildAgesStatController} from '@fe/app/statistics/controller/child-ages-stat-controller';
import {VolunteersByDepartmentsStatController} from '@fe/app/statistics/controller/volunteers-by-departments-stat-controller';
import {VolunteersVisitsStatController} from '@fe/app/statistics/controller/volunteers-visits-stat-controller';
import {ChildrenStatController} from '@fe/app/statistics/controller/children-stat-controller';
import {ChildrenByDepartmentsStatProviderService} from '@fe/app/statistics/service/children-by-departments-stat-provider';
import {ChildAgesByDepartmentsStatProviderService} from '@fe/app/statistics/service/child-ages-by-departments-stat-provider';
import {VolunteersByDepartmentsStatProviderService} from '@fe/app/statistics/service/volunteers-by-departments-stat-provider';

@Component({
    selector: 'app-statistics-widget-container',
    templateUrl: './statistics-widget-container.component.html',
    styleUrl: './statistics-widget-container.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsWidgetContainerComponent {

    private readonly translateService = inject(TranslateService);
    private readonly service = inject(StatisticsService);
    private readonly childrenByDepartmentsStatProvider = inject(ChildrenByDepartmentsStatProviderService);
    private readonly childAgesByDepartmentsStatProvider = inject(ChildAgesByDepartmentsStatProviderService);
    private readonly volunteersByDepartmentsStatProvider = inject(VolunteersByDepartmentsStatProviderService);

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
            new VisitsByDepartmentsStatController(this.translateService, this.service),
            new ChildrenStatController(this.translateService, this.childrenByDepartmentsStatProvider),
            new ChildrenByDepartmentsStatController(this.translateService, this.childrenByDepartmentsStatProvider),
            new ChildAgesStatController(this.translateService, this.childAgesByDepartmentsStatProvider),
            new ChildAgesByDepartmentsStatController(this.translateService, this.childAgesByDepartmentsStatProvider),
            new VolunteersVisitsStatController(this.translateService, this.volunteersByDepartmentsStatProvider),
            new VolunteersByDepartmentsStatController(this.translateService, this.volunteersByDepartmentsStatProvider),
            new VisitsByStatusesStatController(this.translateService, this.service),
            new ActivitiesStatController(this.translateService, this.service),
        ];
    }

}
