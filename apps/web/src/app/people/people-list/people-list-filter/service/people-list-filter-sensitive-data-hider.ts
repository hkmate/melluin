import {inject, Injectable} from '@angular/core';
import {PeopleFilter} from '@fe/app/people/people-list/people-list-filter/service/people-filter';
import {Store} from '@ngrx/store';
import {User} from '@shared/user/user';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import {Permission} from '@shared/user/permission.enum';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Injectable()
export class PeopleListFilterSensitiveDataHider {

    private readonly store = inject(Store);

    private currentUser: User;

    constructor() {
        this.store.pipe(selectCurrentUser, takeUntilDestroyed()).subscribe(cu => {
            this.currentUser = cu;
        });
    }

    public hideData(parsedFilters: PeopleFilter): PeopleFilter {
        const canUserFilterSensitiveData = this.currentUser.permissions.includes(Permission.canReadSensitivePersonData);
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
