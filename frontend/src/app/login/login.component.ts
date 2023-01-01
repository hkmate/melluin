import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../auth/service/authentication.service';
import {isNilOrEmpty, NOOP, Nullable} from '@shared/util/util';
import {User} from '@shared/user/user';
import {AppTitle} from '@fe/app/app-title.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    private static readonly BAD_CREDENTIALS = 'LoginPage.BadCredentials';
    private static readonly FIELDS_REQUIRED = 'LoginPage.FieldsRequired';

    private returnUrl: Nullable<string> = null;
    protected loading = false;
    protected errorMsg: Nullable<string> = null;
    protected userName: Nullable<string> = null;
    protected password: Nullable<string> = null;

    constructor(
        private readonly title: AppTitle,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
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
        this.errorMsg = null;
        if (isNilOrEmpty(this.userName) || isNilOrEmpty(this.password)) {
            this.errorMsg = LoginComponent.FIELDS_REQUIRED;
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
                    this.router.navigate(['']).then(NOOP).catch(NOOP);
                },
                error: error => {
                    this.loading = false;
                    this.errorMsg = LoginComponent.BAD_CREDENTIALS;
                }
            });
    }

}
