import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EventsFilter} from '@fe/app/events/events-list/event-list-filter/events-filter';

@Component({
    selector: 'app-event-list-filter',
    templateUrl: './event-list-filter.component.html',
    styleUrls: ['./event-list-filter.component.scss']
})
export class EventListFilterComponent implements OnInit {

    @Output()
    public filterChanged = new EventEmitter<EventsFilter>();

    protected dateFrom = new Date();
    protected dateTo = new Date();
    protected filterText: string;

    public ngOnInit(): void {
        this.dateFrom = this.getStartOfMonth();
        this.dateTo = this.getEndOfTheMonth();
        this.changed();
    }

    protected changed(): void {
        this.filterChanged.emit({
            dateFrom: this.dateFrom.toISOString(),
            dateTo: this.dateTo.toISOString(),
            text: this.filterText
        });
    }

    protected filterTextChanged(newFilter: string): void {
        this.filterText = newFilter;
        this.changed();
    }

    private getStartOfMonth(): Date {
        const date = new Date();
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return date;
    }

    private getEndOfTheMonth(): Date {
        const date = new Date();
        date.setMonth(date.getMonth() + 1, 1);
        date.setHours(0, 0, 0, 0);
        return date;
    }

}
