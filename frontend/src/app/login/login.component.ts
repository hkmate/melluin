import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../auth/service/authentication.service';
import {isNilOrEmpty, NOOP} from '@shared/util/util';
import {User} from '@shared/user/user';
import {AppTitle} from '@fe/app/app-title.service';
import {MessageService} from '@fe/app/util/message.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    private static readonly BAD_CREDENTIALS = 'LoginPage.BadCredentials';
    private static readonly FIELDS_REQUIRED = 'LoginPage.FieldsRequired';

    private returnUrl?: string;
    protected loading = false;
    protected userName?: string;
    protected password?: string;

    constructor(
        private readonly title: AppTitle,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly msg: MessageService,
        private readonly authenticationService: AuthenticationService,
    ) {
    }

    public ngOnInit(): void {
        this.title.setTitleByI18n('Titles.Login')
        if (this.authenticationService.hasAuthenticatedUser()) {
            this.router.navigate(['/'])
                .then(NOOP)
                .catch(NOOP);
        }
        this.returnUrl = this.route.snapshot.queryParams.returnUrl ?? '/';
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
                error: error => {
                    this.loading = false;
                    this.msg.error(LoginComponent.BAD_CREDENTIALS);
                }
            });
    }

}
