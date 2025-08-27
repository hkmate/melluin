import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../auth/service/authentication.service';
import {isNilOrEmpty, NOOP} from '@shared/util/util';
import {User} from '@shared/user/user';
import {AppTitle} from '@fe/app/app-title.service';
import {MessageService} from '@fe/app/util/message.service';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    private static readonly BAD_CREDENTIALS = 'LoginPage.BadCredentials';
    private static readonly SERVER_NOT_WORK = 'LoginPage.ServerNotWork';
    private static readonly FIELDS_REQUIRED = 'LoginPage.FieldsRequired';

    private readonly title = inject(AppTitle);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly translate = inject(TranslateService);
    private readonly msg = inject(MessageService);
    private readonly authenticationService = inject(AuthenticationService);

    private returnUrl?: string;
    protected loading = false;
    protected userName?: string;
    protected password?: string;

    constructor() {
        this.title.setTitleByI18n('Titles.Login')
        if (this.authenticationService.hasAuthenticatedUser()) {
            this.router.navigate(['/'])
                .then(NOOP)
                .catch(NOOP);
        }
        this.returnUrl = this.route.snapshot.queryParams.returnUrl ?? '/';
    }

    protected isSubmitButtonDisabled(): boolean {
        return this.loading || isNilOrEmpty(this.userName) || isNilOrEmpty(this.password);
    }

    protected onSubmit(): void {
        if (isNilOrEmpty(this.userName) || isNilOrEmpty(this.password)) {
            this.msg.error(LoginComponent.FIELDS_REQUIRED);
            return;
        }
        this.doLogin();
    }

    private doLogin(): void {
        this.loading = true;
        this.authenticationService.login(this.userName!, this.password!)
            .subscribe({
                next: (user: User) => {
                    this.loading = false;
                    this.router.navigate([this.returnUrl ?? '']).then(NOOP).catch(NOOP);
                },
                error: (error: HttpErrorResponse) => {
                    this.loading = false;
                    this.msg.errorRaw(this.resolveErrorMsg(error));
                }
            });
    }

    private resolveErrorMsg(error: HttpErrorResponse): string {
        switch (error.status) {
            case 0:
                return this.translate.instant(LoginComponent.SERVER_NOT_WORK);
            case HttpStatusCode.BadRequest:
                return this.translate.instant(LoginComponent.BAD_CREDENTIALS);
            default:
                return error.message;
        }
    }

}
