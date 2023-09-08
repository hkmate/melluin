import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EventsFilter} from '@fe/app/events/events-list/event-list-filter/events-filter';
import {DateUtil} from '@shared/util/date-util';

@Component({
    selector: 'app-event-list-filter',
    templateUrl: './event-list-filter.component.html',
    styleUrls: ['./event-list-filter.component.scss']
})
export class EventListFilterComponent {

    @Output()
    public filterChanged = new EventEmitter<EventsFilter>();

    @Input()
    public dateFrom = DateUtil.now();

    @Input()
    public dateTo = DateUtil.now();

    protected filterText: string;

    protected changed(): void {
        this.normalizeDates();
        this.filterChanged.emit({
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            text: this.filterText
        });
    }

    protected filterTextChanged(newFilter: string): void {
        this.filterText = newFilter;
        this.changed();
    }

    private normalizeDates(): void {
        this.dateFrom.setHours(0, 0, 0, 0);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        this.dateTo.setHours(23, 59, 59, 999);
    }

}
