import {Component, inject} from '@angular/core';
import {filter} from 'rxjs';
import {reasonIsNotPageData} from '@fe/app/util/list-page-settings-change-reason';
import {PeopleFilter} from '@fe/app/people/people-list/people-list-filter/service/people-filter';
import {PeopleListFilterService} from '@fe/app/people/people-list/people-list-filter/service/people-list-filter.service';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import {Store} from '@ngrx/store';
import {User} from '@shared/user/user';
import {Permission} from '@shared/user/permission.enum';
import {GetRolesService} from '@fe/app/util/get-roles.service';
import {RoleBrief} from '@shared/user/role';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {OperationCity} from '@shared/person/operation-city';

@Component({
    selector: 'app-people-list-filter',
    templateUrl: './people-list-filter.component.html',
    styleUrl: './people-list-filter.component.scss'
})
export class PeopleListFilterComponent {

    protected readonly cityOptions = Object.keys(OperationCity);

    private readonly store = inject(Store);
    private readonly roleService = inject(GetRolesService);
    private readonly filterService = inject(PeopleListFilterService);

    protected filters: PeopleFilter;
    protected roleOptions: Array<RoleBrief>;
    protected needEmailFilter: boolean = true;
    protected needPhoneFilter: boolean = true;

    constructor() {
        this.filterService.onChange().pipe(takeUntilDestroyed(), filter(reasonIsNotPageData)).subscribe(() => {
            this.resetSettings()
        });
        this.store.pipe(selectCurrentUser, takeUntilDestroyed()).subscribe(cu => this.hideSensitiveDataFiltersIfUserIsNotEmployee(cu));
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
