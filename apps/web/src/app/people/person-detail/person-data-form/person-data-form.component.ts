import {ChangeDetectionStrategy, Component, inject, input, linkedSignal, output} from '@angular/core';
import {emptyToUndef, isNil, OperationCities, Permission, Person, PersonRewrite} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {firstValueFrom, Observable} from 'rxjs';
import {disabled, email, form, FormField, minLength, required, submit} from '@angular/forms/signals';
import {PeopleService} from '@fe/app/people/people.service';
import {AppSubmit} from '@fe/app/util/submit/app-submit';
import {t} from '@fe/app/util/translate/translate';
import {MelluinMatErrorComponent} from '@fe/app/util/melluin-mat-error/melluin-mat-error.component';
import {noWhitespaceHeadOrTail} from '@fe/app/util/whitespace-validator/no-whitespace-head-or-tail';

@Component({
    imports: [
        TranslatePipe,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatButton,
        AppSubmit,
        FormField,
        MatError,
        MelluinMatErrorComponent,
        MatInput
    ],
    selector: 'app-person-data-form',
    templateUrl: './person-data-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonDataFormComponent {

    protected readonly cityOptions = Object.values(OperationCities);

    private readonly permissionService = inject(PermissionService);
    private readonly peopleService = inject(PeopleService);

    public readonly person = input<Person>();

    public readonly submitted = output<Person>();
    public readonly canceled = output<void>();

    protected readonly formModel = linkedSignal(() => this.getFormModel(this.person()));
    protected readonly form = form(this.formModel, schema => {
        required(schema.firstName, {message: t('Form.Required')});
        noWhitespaceHeadOrTail(schema.firstName);
        required(schema.lastName, {message: t('Form.Required')});
        noWhitespaceHeadOrTail(schema.lastName);

        email(schema.email, {message: t('Form.EmailFormat')});
        noWhitespaceHeadOrTail(schema.email);

        noWhitespaceHeadOrTail(schema.phone);

        required(schema.cities, {message: t('Form.Required')});
        minLength(schema.cities, 1, {message: t('Form.Min', {min: 1})});
        disabled(schema.cities, () => !this.permissionService.has(Permission.canModifyPersonCity))
    });

    protected submitForm(): void {
        submit(this.form, async () => {
            const saved = await firstValueFrom(this.saveRequest());
            this.submitted.emit(saved);
        });
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private getFormModel(person: Person | undefined) {
        return {
            firstName: person?.firstName ?? '',
            lastName: person?.lastName ?? '',
            cities: person?.cities ?? [OperationCities.PECS],
            email: person?.email ?? '',
            phone: person?.phone ?? '',
        };
    }

    private saveRequest(): Observable<Person> {
        const person = this.person();
        if (isNil(person)) {
            return this.peopleService.addPerson(this.generateDto());
        }
        return this.peopleService.updatePerson(person.id, this.generateDto());
    }

    private generateDto(): PersonRewrite {
        const existingPerson = this.person();
        const formValue = this.form().value();
        return {
            ...formValue,
            email: emptyToUndef(formValue.email),
            phone: emptyToUndef(formValue.phone),
            preferences: existingPerson?.preferences
        } satisfies PersonRewrite
    }

}
