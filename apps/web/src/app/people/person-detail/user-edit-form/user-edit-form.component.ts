import {ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, output} from '@angular/core';
import {
    emptyToUndef,
    isNil,
    passwordMinLength,
    passwordPattern,
    Permission,
    PermissionT,
    RoleBrief,
    User,
    UserCreation,
    UserRewrite,
    UUID
} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {GetRolesService} from '@fe/app/util/get-roles.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {disabled, form, FormField, pattern, required, submit} from '@angular/forms/signals';
import {t} from '@fe/app/util/translate/translate';
import {firstValueFrom, Observable} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {AppSubmit} from '@fe/app/util/submit/app-submit';
import {PasswordInputComponent} from '@fe/app/util/password-input/password-input.component';
import {UserService} from '@fe/app/people/user.service';
import {MelluinMatErrorComponent} from '@fe/app/util/melluin-mat-error/melluin-mat-error.component';
import {noWhitespaceHeadOrTail} from '@fe/app/util/whitespace-validator/no-whitespace-head-or-tail';

@Component({
    imports: [
        TranslatePipe,
        MatFormField,
        MatLabel,
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        MatCardContent,
        MatSlideToggle,
        MatSelect,
        MatOption,
        MatButton,
        AppSubmit,
        FormField,
        PasswordInputComponent,
        MatError,
        MatInput,
        MelluinMatErrorComponent
    ],
    selector: 'app-user-edit-form',
    templateUrl: './user-edit-form.component.html',
    styleUrls: ['./user-edit-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditFormComponent {

    private readonly roleService = inject(GetRolesService);
    private readonly permission = inject(PermissionService);
    private readonly userService = inject(UserService);

    protected readonly permissions: Array<PermissionT> = Object.values(Permission);

    public readonly personId = input.required<UUID>();
    public readonly user = input<User>();

    public readonly submitted = output<User>();
    public readonly canceled = output<void>();

    protected readonly roles = toSignal(this.roleService.getAll(), {initialValue: []});
    protected readonly roleOptions = computed(() => this.computeRoleOptions());
    protected readonly passwordHint = computed(() => this.computePasswordHint());

    protected readonly formModel = linkedSignal(() => this.getFormModel(this.user()));
    protected readonly form = form(this.formModel, schema => {
        required(schema.userName, {message: t('Form.Required')});
        noWhitespaceHeadOrTail(schema.userName);

        required(schema.password, {message: t('Form.Required'), when: () => isNil(this.user())});
        pattern(schema.password, new RegExp(passwordPattern),
            {message: t('PersonPage.User.Form.PasswordPatternHint', {passwordMinLength})}
        );

        disabled(schema.customPermissions, () => !this.permission.has(Permission.canManagePermissions));
        disabled(schema.isActive, () => isNil(this.user()));
    });

    protected submitForm(): void {
        submit(this.form, async () => {
            const saved = await firstValueFrom(this.save());
            this.submitted.emit(saved);
        });
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private getFormModel(user: User | undefined) {
        return {
            userName: user?.userName ?? '',
            password: '',
            isActive: user?.isActive ?? true,
            roleNames: user?.roles?.map(r => r.name) ?? [],
            customPermissions: user?.customPermissions ?? []
        };
    }

    private save(): Observable<User> {
        const user = this.user();
        if (isNil(user)) {
            return this.userService.addUser(this.generateCreateDto());
        }
        return this.userService.updateUser(user.id, this.generateRewriteDto());
    }

    private generateRewriteDto(): UserRewrite {
        const {password, ...formValue} = this.form().value();
        return {
            ...formValue,
            password: emptyToUndef(password),
        } satisfies UserRewrite;
    }

    private generateCreateDto(): UserCreation {
        const {isActive, ...formValue} = this.form().value();
        return {
            ...formValue,
            personId: this.personId(),
        } satisfies UserCreation
    }

    private computeRoleOptions(): Array<RoleBrief> {
        const manageableRoleTypes = this.permission.getRolesTypesCanBeManaged();
        return this.roles().filter(role => manageableRoleTypes.includes(role.type));
    }

    private computePasswordHint(): string | undefined {
        if (this.user()) {
            return t('PersonPage.User.Form.PasswordHint');
        }
        return undefined;
    }

}
