import {NgModule} from '@angular/core';
import {EventsListComponent} from './events-list/events-list.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {CommonModule, DatePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {MatChipsModule} from '@angular/material/chips';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {EventListFilterComponent} from './events-list/event-list-filter/event-list-filter.component';
import {LazyInputModule} from '@fe/app/util/lazy-input/lazy-input.module';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatOptionModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {HospitalEventsListModule} from '@fe/app/hospital/visit/hospital-events-list/hospital-events-list.module';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {PersonSelectModule} from '@fe/app/util/person-select/person-select.module';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        DatePipe,
        ReactiveFormsModule,
        FormsModule,

        MatPaginatorModule,
        MatCardModule,
        MatIconModule,
        MatChipsModule,
        MatInputModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatOptionModule,
        MatSelectModule,
        MatExpansionModule,
        TranslateModule,

        PersonNamePipe,
        LazyInputModule,
        HospitalEventsListModule,
        PersonSelectModule,
    ],
    declarations: [
        EventsListComponent,
        EventListFilterComponent
    ]
})
export class EventsModule {
}
