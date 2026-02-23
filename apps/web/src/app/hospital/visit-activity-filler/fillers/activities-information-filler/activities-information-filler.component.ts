import {Component, effect, inject, input, signal} from '@angular/core';
import {VisitActivityInformationService} from '@fe/app/hospital/visit-activity/visit-activity-information.service';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Permission} from '@melluin/common';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatCard, MatCardContent} from '@angular/material/card';

@Component({
    selector: 'app-activities-information-filler',
    templateUrl: './activities-information-filler.component.html',
    imports: [
        TranslatePipe,
        MatMiniFabButton,
        MatIcon,
        MatFormField,
        MatInput,
        ReactiveFormsModule,
        MatButton,
        MatCardContent,
        MatCard
    ],
    styleUrl: './activities-information-filler.component.scss'
})
export class ActivitiesInformationFillerComponent {

    protected readonly Permission = Permission;

    protected readonly permissions = inject(PermissionService);
    private readonly activitiesInformationService = inject(VisitActivityInformationService);

    public readonly visitId = input.required<string>();

    protected readonly formControl = new FormControl<string>('', {nonNullable: true});
    protected readonly editMode = signal<boolean>(false);
    protected readonly originalInfo = signal<string>('');
    protected readonly buttonsDisabled = signal<boolean>(false);

    constructor() {
        effect(() => {
            this.activitiesInformationService.getActivitiesInformation(this.visitId()).subscribe(info => {
                this.originalInfo.set(info.content ?? '');
                this.formControl.setValue(this.originalInfo());
            })
        });
    }

    protected toggleEditMode(): void {
        this.editMode.update(value => !value);
        this.formControl.setValue(this.originalInfo());
    }

    protected submitForm(): void {
        this.buttonsDisabled.set(true);
        this.activitiesInformationService.set(this.visitId(), {content: this.formControl.value}).subscribe(info => {
            this.originalInfo.set(info.content ?? '');
            this.buttonsDisabled.set(false);
            this.toggleEditMode();
        });
    }

}
