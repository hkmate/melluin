import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../auth/service/authentication.service';
import {AuthCredentials, NOOP} from '@melluin/common';
import {AppTitle} from '@fe/app/app-title.service';
import {MessageService} from '@fe/app/util/message.service';
import {TranslatePipe} from '@ngx-translate/core';
import {TrimmedTextInputComponent2} from '@fe/app/util/trimmed-text-input/trimmed-text-input.component';
import {MatButton} from '@angular/material/button';
import {form, FormField, required, submit} from '@angular/forms/signals';
import {finalize, firstValueFrom} from 'rxjs';
import {getErrorHandler} from '@fe/app/util/util';
import {AppSubmit} from '@fe/app/util/submit/app-submit';
import {t} from '@fe/app/util/translate/translate';
import {PasswordInputComponent} from '@fe/app/util/password-input/password-input.component';

@Component({
    imports: [
        TrimmedTextInputComponent2,
        TranslatePipe,
        MatButton, FormField, AppSubmit, PasswordInputComponent,
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

    private readonly title = inject(AppTitle);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly msg = inject(MessageService);
    private readonly authenticationService = inject(AuthenticationService);

    protected readonly loading = signal(false);
    private readonly returnUrl = signal<string | null>(null);
    private readonly loginModel = signal<AuthCredentials>({
        username: '',
        password: '',
    });

    protected readonly loginForm = form(this.loginModel, schema => {
        required(schema.username, {message: t('LoginPage.UsernameRequired')});
        required(schema.password, {message: t('LoginPage.PasswordRequired')});
    });

    constructor() {
        this.title.setTitleByI18n('Titles.Login')
        if (this.authenticationService.hasAuthenticatedUser()) {
            this.router.navigate(['/'])
                .then(NOOP)
                .catch(NOOP);
        }
        this.returnUrl.set(this.route.snapshot.queryParams.returnUrl ?? '/');
    }

    protected onSubmit(): void {
        submit(this.loginForm, () => this.doLogin());
    }

    private async doLogin(): Promise<void> {
        this.loading.set(true);
        await firstValueFrom(
            this.authenticationService.login(this.loginModel())
                .pipe(
                    finalize(() => this.loading.set(false)),
                    getErrorHandler(this.msg)
                ));
        this.router.navigateByUrl(this.returnUrl() ?? '/').catch(NOOP);
    }

}
