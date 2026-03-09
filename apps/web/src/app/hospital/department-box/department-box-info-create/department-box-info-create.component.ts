import {ChangeDetectionStrategy, Component, inject, input, output, signal} from '@angular/core';
import {
    BoxStatusChangeReason,
    DepartmentBoxStatus,
    DepartmentBoxStatusReport,
    isNotNil,
    Nullable
} from '@melluin/common';
import {affectedObjectsList} from '@fe/app/hospital/department-box/affected-objects-list';
import {MessageService} from '@fe/app/util/message.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatError, MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButton} from '@angular/material/button';
import {form, FormField, required, submit} from '@angular/forms/signals';
import {TrimmedTextInputComponent2} from '@fe/app/util/trimmed-text-input/trimmed-text-input.component';
import {firstValueFrom} from 'rxjs';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {AppSubmit} from '@fe/app/util/submit/app-submit';
import {MelluinMatErrorComponent} from '@fe/app/util/melluin-mat-error/melluin-mat-error.component';
import {t} from '@fe/app/util/translate/translate';

@Component({
    imports: [
        MatCardContent,
        MatFormField,
        MatCard,
        MatLabel,
        MatSelect,
        TranslatePipe,
        MatOption,
        TrimmedTextInputComponent2,
        MatButton,
        AppSubmit,
        FormField,
        MatError,
        MelluinMatErrorComponent
    ],
    selector: 'app-department-box-info-create',
    templateUrl: './department-box-info-create.component.html',
    styleUrls: ['./department-box-info-create.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentBoxInfoCreateComponent {

    protected readonly reasonOptions: Array<BoxStatusChangeReason> = Object.values(BoxStatusChangeReason);
    protected readonly affectedObjectsOptions = affectedObjectsList;

    private readonly boxStatusService = inject(DepartmentBoxService);
    private readonly msg = inject(MessageService);

    public readonly departmentId = input.required<string>();
    public readonly visitId = input<string | undefined>(undefined);

    public readonly submitted = output<DepartmentBoxStatus>();
    public readonly canceled = output<void>();

    protected readonly formModel = signal({
        reason: null as Nullable<BoxStatusChangeReason>,
        affectedObject: null as Nullable<string>,
        comment: ''
    })

    protected readonly form = form(this.formModel, schema => {
        required(schema.reason, {message: t('BoxStatus.ReasonIsRequired')});
    });

    protected submitForm(): void {
        submit(this.form, async () => {
            const saved = await this.saveReport();
            this.msg.success('SaveSuccessful');
            this.submitted.emit(saved);
        });
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    private saveReport(): Promise<DepartmentBoxStatus> {
        const objectToSave: DepartmentBoxStatusReport = {
            reason: this.formModel().reason!,
            affectedObject: this.formModel().affectedObject ?? undefined,
            comment: this.formModel().comment ?? undefined
        } satisfies DepartmentBoxStatusReport;
        if (isNotNil(this.visitId())) {
            objectToSave.visitId = this.visitId();
        }
        return firstValueFrom(this.boxStatusService.addBoxStatus(this.departmentId(), objectToSave));
    }

}
