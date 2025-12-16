import {Component, signal} from '@angular/core';
import dayjs from 'dayjs';
import {TimeInterval} from '@fe/app/statistics/model/time-interval';
import {Permission} from '@shared/user/permission.enum';


function getDefaultInterval(): TimeInterval {
    const now = dayjs().toISOString();
    const lastMonth = dayjs().subtract(1, 'month').toISOString();
    return {from: lastMonth, to: now};
}


@Component({
    selector: 'app-statistics-layout',
    templateUrl: './statistics-layout.component.html',
    styleUrl: './statistics-layout.component.scss'
})
export class StatisticsLayoutComponent {

    protected readonly Permission = Permission;

    protected readonly timeInterval = signal<TimeInterval>(getDefaultInterval());

    protected setTimeInterval(newVale: TimeInterval): void {
        this.timeInterval.set(newVale);
    }

}
