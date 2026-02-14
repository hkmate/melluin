import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {tap} from 'rxjs';
import {AppActions} from '@fe/app/state/app-actions';
import {CredentialStoreService} from '@fe/app/auth/service/credential-store.service';


@Injectable()
export class UserDataSaverEffect {

    currentUserLoaded$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.currentUserLoaded),
        tap(prop => {
            this.credentialStoreService.storeUser(prop.user);
        })
    ), {dispatch: false});

    userSettingsLoaded = createEffect(() => this.actions$.pipe(
        ofType(AppActions.userSettingsLoaded),
        tap(prop => {
            this.credentialStoreService.storeUserSettings(prop.userSettings);
        })
    ), {dispatch: false});

    constructor(private readonly actions$: Actions,
                private readonly credentialStoreService: CredentialStoreService) {
    }

}
