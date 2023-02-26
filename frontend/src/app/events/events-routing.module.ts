import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from '@fe/app/auth/service/auth.guard';
import {EventsListComponent} from '@fe/app/events/events-list/events-list.component';
import {EventsModule} from '@fe/app/events/events.module';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: EventsListComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),

        EventsModule
    ],
    exports: [RouterModule]
})
export class EventsRoutingModule {
}
