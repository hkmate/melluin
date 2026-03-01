import {inject, Injectable} from '@angular/core';
import {PeopleFilter} from '@fe/app/people/people-list/people-list-filter/service/people-filter';
import {Permission} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';


@Injectable()
export class PeopleListFilterSensitiveDataHider {

    private readonly permissions = inject(PermissionService);

    public hideData(parsedFilters: PeopleFilter): PeopleFilter {
        const canUserFilterSensitiveData = this.permissions.has(Permission.canReadSensitivePersonData);
        if (canUserFilterSensitiveData) {
            return parsedFilters;
        }

        return {
            ...parsedFilters,
            email: '',
            phone: ''
        };
    }

}
