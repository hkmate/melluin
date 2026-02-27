import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../auth/service/authentication.service';
import {AuthCredentials, NOOP, User} from '@melluin/common';
import {AppTitle} from '@fe/app/app-title.service';
import {MessageService} from '@fe/app/util/message.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {TrimmedTextInputComponent2} from '@fe/app/util/trimmed-text-input/trimmed-text-input.component';
import {MatButton} from '@angular/material/button';
import {form, FormField, required} from '@angular/forms/signals';
import {finalize} from 'rxjs';
import {getErrorHandler} from '@fe/app/util/util';

@Component({
    imports: [
        FormsModule,
        TrimmedTextInputComponent2,
        TranslatePipe,
        MatButton, FormField,
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    private readonly title = inject(AppTitle);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly translate = inject(TranslateService);
    private readonly msg = inject(MessageService);
    private readonly authenticationService = inject(AuthenticationService);

    protected readonly loading = signal(false);
    private readonly returnUrl = signal<string | null>(null);
    private readonly loginModel = signal<AuthCredentials>({
        username: '',
        password: '',
    });

    protected readonly loginForm = form(this.loginModel, schema => {
        required(schema.username, {message: this.translate.instant('LoginPage.UsernameRequired')});
        required(schema.password, {message: this.translate.instant('LoginPage.PasswordRequired')});
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
        if (this.loginForm().invalid()) {
            return;
        }
        this.doLogin();
    }

    private doLogin(): void {
        this.loading.set(true);
        this.authenticationService.login(this.loginModel())
            .pipe(
                finalize(() => this.loading.set(false)),
                getErrorHandler(this.msg)
            )
            .subscribe((user: User) => {
                this.router.navigateByUrl(this.returnUrl() ?? '/').catch(NOOP);
            });
    }

}
