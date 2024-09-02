import {Injectable} from '@angular/core';
import {PeopleFilter} from '@fe/app/people/people-list/people-list-filter/service/people-filter';
import {Store} from '@ngrx/store';
import {AutoUnSubscriber} from '@fe/app/util/auto-un-subscriber';
import {User} from '@shared/user/user';
import {selectCurrentUser} from '@fe/app/state/selector/current-user.selector';
import {Permission} from '@shared/user/permission.enum';


@Injectable()
export class PeopleListFilterSensitiveDataHider extends AutoUnSubscriber {

    private currentUser: User;

    constructor(private readonly store: Store) {
        super();
        this.addSubscription(this.store.pipe(selectCurrentUser), cu => {
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
