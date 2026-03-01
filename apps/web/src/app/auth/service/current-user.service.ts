import {inject, Injectable, Signal} from '@angular/core';
import {User, UserSettings} from '@melluin/common';
import {CredentialStoreService} from '@fe/app/auth/service/credential-store.service';

@Injectable({providedIn: 'root'})
export class CurrentUserService {

    private readonly credentials = inject(CredentialStoreService);

    public get currentUser(): Signal<User | undefined> {
        return this.credentials.getUser();
    }

    public get userSettings(): Signal<UserSettings | undefined> {
        return this.credentials.getUserSettings();
    }

}
