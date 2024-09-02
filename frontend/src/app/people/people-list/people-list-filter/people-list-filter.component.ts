import {Component, OnInit} from '@angular/core';
import {filter} from 'rxjs';
import {reasonIsNotPageData} from '@fe/app/util/list-page-settings-change-reason';
import {AutoUnSubscriber} from '@fe/app/util/auto-un-subscriber';
import {PeopleFilter} from '@fe/app/people/people-list/people-list-filter/service/people-filter';
import {PeopleListFilterService} from '@fe/app/people/people-list/people-list-filter/service/people-list-filter.service';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import {Store} from '@ngrx/store';
import {User} from '@shared/user/user';
import {Permission} from '@shared/user/permission.enum';
import {GetRolesService} from '@fe/app/util/get-roles.service';
import {RoleBrief} from '@shared/user/role';

@Component({
    selector: 'app-people-list-filter',
    templateUrl: './people-list-filter.component.html',
    styleUrl: './people-list-filter.component.scss'
})
export class PeopleListFilterComponent extends AutoUnSubscriber implements OnInit {

    protected filters: PeopleFilter;
    protected roleOptions: Array<RoleBrief>;
    protected needEmailFilter: boolean = true;
    protected needPhoneFilter: boolean = true;

    constructor(private readonly store: Store,
                private readonly roleService: GetRolesService,
                private readonly filterService: PeopleListFilterService) {
        super();
    }

    public ngOnInit(): void {
        this.addSubscription(this.filterService.onChange().pipe(filter(reasonIsNotPageData)), () => {
            this.resetSettings()
        });
        this.addSubscription(this.store.pipe(selectCurrentUser), cu => this.hideSensitiveDataFiltersIfUserIsNotEmployee(cu));
        this.loadRoles();
        this.resetSettings();
    }

    protected filterSet(): void {
        this.filterService.setFilter(this.filters);
    }

    private resetSettings(): void {
        this.filters = this.filterService.getFilter();
    }

    private loadRoles(): void {
        this.roleService.getAll().subscribe(roles => {
            this.roleOptions = roles;
        })
    }

    private hideSensitiveDataFiltersIfUserIsNotEmployee(user: User): void {
        const canFilterSensitiveData = user.permissions.includes(Permission.canReadSensitivePersonData);
        this.needEmailFilter = canFilterSensitiveData;
        this.needPhoneFilter = canFilterSensitiveData;
    }

}
