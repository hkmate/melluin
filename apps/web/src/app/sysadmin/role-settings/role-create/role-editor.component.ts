import {ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, output} from '@angular/core';
import {isNil, Permission, Role, RoleCreation, RoleType} from '@melluin/common';
import {RoleService} from '@fe/app/sysadmin/role-settings/role.service';
import {MessageService} from '@fe/app/util/message.service';
import {TrimmedTextInputComponent2} from '@fe/app/util/trimmed-text-input/trimmed-text-input.component';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatFormField} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {form, FormField, min, required, submit} from '@angular/forms/signals';
import {firstValueFrom} from 'rxjs';
import {AppSubmit} from '@fe/app/util/submit/app-submit';

@Component({
    imports: [
        TrimmedTextInputComponent2,
        TranslatePipe,
        MatFormField,
        MatSelect,
        MatOption,
        MatIconButton,
        MatIcon,
        AppSubmit,
        FormField
    ],
    selector: 'app-role-edit',
    templateUrl: './role-editor.component.html',
    styleUrl: './role-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleEditorComponent {

    protected readonly roleTypeOptions = Object.values(RoleType);
    protected readonly permissionOptions = Object.values(Permission);

    private readonly msg = inject(MessageService);
    private readonly translate = inject(TranslateService);
    private readonly roleService = inject(RoleService);

    public readonly role = input<Role>();

    public readonly submitted = output<Role>();
    public readonly canceled = output<void>();

    protected readonly saveButtonDisabled = computed(() =>
        this.form().submitting() || (this.form().invalid() && this.form().touched())
    );

    protected readonly formModel = linkedSignal<RoleCreation>(() => this.setupFormValues());
    protected readonly form = form(this.formModel, schema => {
        required(schema.name, {message: this.translate.instant('Form.Required')});
        min(schema.type, 3, {message: this.translate.instant('Form.Min', {min: 3})});
        required(schema.type, {message: this.translate.instant('Form.Required')});
    });

    protected submitForm(): void {
        submit(this.form, async () => {
            const saved = await this.saveRole();
            this.msg.success('SaveSuccessful');
            this.submitted.emit(saved);
        });
    }

    protected cancel(): void {
        this.canceled.emit();
    }

    private setupFormValues(): RoleCreation {
        const role = this.role();
        if (isNil(role)) {
            return this.getDefaultFormModel();
        }

        const {id, ...values} = role;
        return values;
    }

    private getDefaultFormModel(): RoleCreation {
        return {
            name: '',
            type: RoleType.INTERN,
            permissions: []
        };
    }

    private saveRole(): Promise<Role> {
        const editedRole = this.role();
        const editedValues = this.form().value();
        if (isNil(editedRole)) {
            return firstValueFrom(this.roleService.create(editedValues));
        }
        return firstValueFrom(this.roleService.update({...editedRole, ...editedValues}));
    }

}
