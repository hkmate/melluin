import {Component, OnInit} from '@angular/core';
import {filter} from 'rxjs';
import {reasonIsNotPageData} from '@fe/app/util/list-page-settings-change-reason';
import {AutoUnSubscriber} from '@fe/app/util/auto-un-subscriber';
import {PeopleFilter} from '@fe/app/people/people-list/people-list-filter/service/people-filter';
import {foundationWorkerRoles, Role} from '@shared/user/role.enum';
import {PeopleListFilterService} from '@fe/app/people/people-list/people-list-filter/service/people-list-filter.service';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import {Store} from '@ngrx/store';
import {includeAny} from '@shared/util/util';
import {User} from '@shared/user/user';

@Component({
    selector: 'app-people-list-filter',
    templateUrl: './people-list-filter.component.html',
    styleUrl: './people-list-filter.component.scss'
})
export class PeopleListFilterComponent extends AutoUnSubscriber implements OnInit {

    protected filters: PeopleFilter;
    protected roleOptions: Array<Role> = Object.values(Role);
    protected needEmailFilter: boolean = true;
    protected needPhoneFilter: boolean = true;

    constructor(private readonly store: Store,
                private readonly filterService: PeopleListFilterService) {
        super();
    }

    public ngOnInit(): void {
        this.addSubscription(this.filterService.onChange().pipe(filter(reasonIsNotPageData)), () => {
            this.resetSettings()
        });
        this.addSubscription(this.store.pipe(selectCurrentUser), cu => this.hideSensitiveDataFiltersIfUserIsNotEmployee(cu));
        this.resetSettings();
    }

    protected filterSet(): void {
        this.filterService.setFilter(this.filters);
    }

    private resetSettings(): void {
        this.filters = this.filterService.getFilter();
    }

    private hideSensitiveDataFiltersIfUserIsNotEmployee(user: User): void {
        const canFilterSensitiveData = includeAny(user.roles, ...foundationWorkerRoles);
        this.needEmailFilter = canFilterSensitiveData;
        this.needPhoneFilter = canFilterSensitiveData;
    }

}
