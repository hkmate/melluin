import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../auth/service/authentication.service';
import {isNilOrEmpty} from '../util/util';
import {User} from '../auth/model/user';

@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

    private static readonly BAD_CREDENTIALS = 'LoginPage.BadCredentials';
    private static readonly FIELDS_REQUIRED = 'LoginPage.FieldsRequired';

    private returnUrl: string;
    protected loading: boolean = false;
    protected errorMsg: string | null;
    protected userName: string | null;
    protected password: string | null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
    ) {
    }

    public ngOnInit(): void {
        if (this.authenticationService.hasAuthenticatedUser()) {
            this.router.navigate(['/']);
        }
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
        this.authenticationService.login(this.userName, this.password)
            .subscribe({
                next: (user: User) => {
                    this.loading = false;
                    this.router.navigate(['']);
                },
                error: (error) => {
                    this.loading = false;
                    this.errorMsg = LoginComponent.BAD_CREDENTIALS;
                }
            });
    }

}
