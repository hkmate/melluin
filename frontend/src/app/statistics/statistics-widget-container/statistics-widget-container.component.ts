import {Component} from '@angular/core';
import {StatisticWidgetController} from '@fe/app/statistics/controller/widget-controller';

@Component({
    selector: 'app-statistics-widget-container',
    templateUrl: './statistics-widget-container.component.html',
    styleUrl: './statistics-widget-container.component.scss'
})
export class StatisticsWidgetContainerComponent {

    protected readonly controllers = this.createControllers();


    private createControllers(): Array<StatisticWidgetController> {
        return [];
    }

}
