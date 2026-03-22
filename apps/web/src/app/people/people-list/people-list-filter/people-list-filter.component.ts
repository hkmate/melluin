import {ChangeDetectionStrategy, Component, computed, effect, inject, signal} from '@angular/core';
import {filter} from 'rxjs';
import {reasonIsNotPageData} from '@fe/app/util/list-page-settings-change-reason';
import {PeopleListFilterService} from '@fe/app/people/people-list/people-list-filter/service/people-list-filter.service';
import {OperationCities, Permission} from '@melluin/common';
import {GetRolesService} from '@fe/app/util/get-roles.service';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {LazyInputComponent2} from '@fe/app/util/lazy-input/lazy-input.component';
import {TranslatePipe} from '@ngx-translate/core';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {form, FormField} from '@angular/forms/signals';
import {MatCard, MatCardSubtitle} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {isEqual} from 'lodash-es';

@Component({
    imports: [
        LazyInputComponent2,
        TranslatePipe,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatCardSubtitle,
        MatCard,
        MatCheckbox,
        FormField
    ],
    selector: 'app-people-list-filter',
    templateUrl: './people-list-filter.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleListFilterComponent {

    protected readonly cityOptions = Object.values(OperationCities);

    private readonly permissions = inject(PermissionService);
    private readonly roleService = inject(GetRolesService);
    private readonly filterService = inject(PeopleListFilterService);

    protected readonly roleOptions = toSignal(this.roleService.getAll(), {initialValue: []});
    protected readonly needSensitiveFilter = computed(() => this.permissions.has(Permission.canReadSensitivePersonData));
    protected readonly filterModel = signal(this.filterService.getFilter(), {equal: isEqual});
    protected readonly form = form(this.filterModel)

    constructor() {
        this.filterService.onChange()
            .pipe(takeUntilDestroyed(), filter(reasonIsNotPageData))
            .subscribe(() => this.resetSettings());
        effect(() => this.filterService.setFilter(this.filterModel()));
    }

    private resetSettings(): void {
        this.filterModel.set(this.filterService.getFilter());
    }

}
