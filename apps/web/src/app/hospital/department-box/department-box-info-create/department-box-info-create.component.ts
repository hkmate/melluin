import {Component, inject, input, output, signal} from '@angular/core';
import {BoxStatusChangeReason, DepartmentBoxStatusReport} from '@melluin/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {affectedObjectsList} from '@fe/app/hospital/department-box/affected-objects-list';
import {MessageService} from '@fe/app/util/message.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {TrimmedTextInputComponent} from '@fe/app/util/trimmed-text-input/trimmed-text-input.component';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'app-department-box-info-create',
    templateUrl: './department-box-info-create.component.html',
    imports: [
        MatCardContent,
        MatFormField,
        MatCard,
        MatLabel,
        MatSelect,
        ReactiveFormsModule,
        TranslatePipe,
        MatOption,
        TrimmedTextInputComponent,
        MatButton
    ],
    styleUrls: ['./department-box-info-create.component.scss']
})
export class DepartmentBoxInfoCreateComponent {

    private readonly formBuilder = inject(FormBuilder);
    private readonly msg = inject(MessageService);


    public readonly buttonsDisabled = input<boolean>(false);

    public readonly submitted = output<DepartmentBoxStatusReport>();
    public readonly canceled = output<void>();

    protected reasonOptions: Array<BoxStatusChangeReason> = Object.values(BoxStatusChangeReason);
    protected affectedObjectsOptions = affectedObjectsList;
    protected readonly form = signal(this.initForm());

    protected onFormSubmit(): void {
        if (this.form().invalid) {
            this.msg.error('BoxStatus.ReasonIsRequired');
            return;
        }
        this.submitted.emit(this.createObjectFromForm());
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    private initForm(): FormGroup {
        return this.formBuilder.group({
            reason: [null, [Validators.required]],
            affectedObject: [],
            comment: []
        })
    }

    private createObjectFromForm(): DepartmentBoxStatusReport {
        return {
            reason: this.form().controls.reason.value,
            affectedObject: this.form().controls.affectedObject.value,
            comment: this.form().controls.comment.value,
        }
    }

}
