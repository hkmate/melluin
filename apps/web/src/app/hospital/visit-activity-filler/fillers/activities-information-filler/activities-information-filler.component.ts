import {ChangeDetectionStrategy, Component, effect, inject, input, signal} from '@angular/core';
import {VisitActivityInformationService} from '@fe/app/hospital/visit-activity/visit-activity-information.service';
import {Permission, UUID} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatCard, MatCardContent} from '@angular/material/card';
import {form, FormField, submit} from '@angular/forms/signals';
import {firstValueFrom} from 'rxjs';
import {AppSubmit} from '@fe/app/util/submit/app-submit';

@Component({
    imports: [
        TranslatePipe,
        MatMiniFabButton,
        MatIcon,
        MatFormField,
        MatInput,
        MatButton,
        MatCardContent,
        MatCard,
        FormField,
        AppSubmit
    ],
    providers: [VisitActivityInformationService],
    selector: 'app-activities-information-filler',
    templateUrl: './activities-information-filler.component.html',
    styleUrl: './activities-information-filler.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesInformationFillerComponent {

    protected readonly Permission = Permission;

    protected readonly permissions = inject(PermissionService);
    private readonly activitiesInformationService = inject(VisitActivityInformationService);

    public readonly visitId = input.required<UUID>();

    protected readonly editMode = signal<boolean>(false);
    protected readonly originalInfo = signal<string>('');
    protected readonly contentForm = form(signal({text: ''}));

    constructor() {
        effect(() => {
            this.activitiesInformationService.getActivitiesInformation(this.visitId()).subscribe(info => {
                this.originalInfo.set(info.content ?? '');
                this.contentForm.text().reset(info.content ?? '');
            })
        });
    }

    protected toggleEditMode(): void {
        this.editMode.update(value => !value);
        this.contentForm.text().reset(this.originalInfo());
    }

    protected submitForm(): void {
        submit(this.contentForm, async () => {
            const newInfo = await firstValueFrom(
                this.activitiesInformationService.set(this.visitId(), {content: this.contentForm.text().value()})
            );
            this.originalInfo.set(newInfo.content ?? '');
            this.toggleEditMode();
        });
    }

}
