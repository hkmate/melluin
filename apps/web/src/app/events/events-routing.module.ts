import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuardFn} from '@fe/app/auth/service/auth.guard';
import {EventsListComponent} from '@fe/app/events/events-list/events-list.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canMatch: [AuthGuardFn],
                component: EventsListComponent,
            }
        ]),
    ],
    exports: [RouterModule]
})
export default class EventsRoutingModule {
}
