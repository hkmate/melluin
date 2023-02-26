import {NgModule} from '@angular/core';
import {EventsListComponent} from './events-list/events-list.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {HospitalEventCardComponent} from './hospital-event-card/hospital-event-card.component';
import {CommonModule, DatePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {MatChipsModule} from '@angular/material/chips';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import { EventListFilterComponent } from './events-list/event-list-filter/event-list-filter.component';
import {LazyInputModule} from '@fe/app/util/lazy-input/lazy-input.module';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        DatePipe,
        FormsModule,

        MatPaginatorModule,
        MatCardModule,
        MatIconModule,
        MatChipsModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        TranslateModule,

        PersonNamePipe,
        LazyInputModule
    ],
    declarations: [
        EventsListComponent,
        HospitalEventCardComponent,
        EventListFilterComponent
    ]
})
export class EventsModule {
}
