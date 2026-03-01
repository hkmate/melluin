import {Component, computed, inject} from '@angular/core';
import {filter} from 'rxjs';
import {reasonIsNotPageData} from '@fe/app/util/list-page-settings-change-reason';
import {PeopleFilter} from '@fe/app/people/people-list/people-list-filter/service/people-filter';
import {PeopleListFilterService} from '@fe/app/people/people-list/people-list-filter/service/people-list-filter.service';
import {OperationCity, Permission, RoleBrief} from '@melluin/common';
import {GetRolesService} from '@fe/app/util/get-roles.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {LazyInputComponent} from '@fe/app/util/lazy-input/lazy-input.component';
import {TranslatePipe} from '@ngx-translate/core';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatCard, MatCardSubtitle} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {PermissionService} from '@fe/app/auth/service/permission.service';

@Component({
    imports: [
        LazyInputComponent,
        TranslatePipe,
        MatFormField,
        MatLabel,
        MatSelect,
        FormsModule,
        MatOption,
        MatCardSubtitle,
        MatCard,
        MatCheckbox
    ],
    selector: 'app-people-list-filter',
    templateUrl: './people-list-filter.component.html',
    styleUrl: './people-list-filter.component.scss'
})
export class PeopleListFilterComponent {

    protected readonly cityOptions = Object.keys(OperationCity);

    private readonly permissions = inject(PermissionService);
    private readonly roleService = inject(GetRolesService);
    private readonly filterService = inject(PeopleListFilterService);

    protected filters: PeopleFilter;
    protected roleOptions: Array<RoleBrief>;
    protected readonly needEmailFilter = computed(() => this.permissions.has(Permission.canReadSensitivePersonData));
    protected readonly needPhoneFilter = computed(() => this.permissions.has(Permission.canReadSensitivePersonData));

    constructor() {
        this.filterService.onChange().pipe(takeUntilDestroyed(), filter(reasonIsNotPageData)).subscribe(() => {
            this.resetSettings()
        });
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

}
