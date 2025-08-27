import {Component, inject, input, output, signal} from '@angular/core';
import {DepartmentBoxStatusReport} from '@shared/department/box/department-box-status-report';
import {BoxStatusChangeReason} from '@shared/department/box/box-status-change-reason';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {affectedObjectsList} from '@fe/app/hospital/department-box/affected-objects-list';
import {MessageService} from '@fe/app/util/message.service';

@Component({
    selector: 'app-department-box-info-create',
    templateUrl: './department-box-info-create.component.html',
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
