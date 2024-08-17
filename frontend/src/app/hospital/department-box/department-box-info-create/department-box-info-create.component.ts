import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
export class DepartmentBoxInfoCreateComponent implements OnInit {

    @Input()
    public buttonsDisabled: boolean;

    @Output()
    public submitted = new EventEmitter<DepartmentBoxStatusReport>();

    @Output()
    public canceled = new EventEmitter<void>();

    protected reasonOptions: Array<BoxStatusChangeReason> = Object.values(BoxStatusChangeReason);
    protected affectedObjectsOptions = affectedObjectsList;
    protected form: FormGroup;

    constructor(private readonly formBuilder: FormBuilder,
                private readonly msg: MessageService) {
    }

    public ngOnInit(): void {
        this.initForm();
    }

    protected onFormSubmit(): void {
        if (this.form.invalid) {
            this.msg.error('BoxStatus.ReasonIsRequired');
            return;
        }
        this.submitted.emit(this.createObjectFromForm());
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }


    private initForm(): void {
        this.form = this.formBuilder.group({
            reason: [null, [Validators.required]],
            affectedObject: [],
            comment: []
        })
    }

    private createObjectFromForm(): DepartmentBoxStatusReport {
        return {
            reason: this.form.controls.reason.value,
            affectedObject: this.form.controls.affectedObject.value,
            comment: this.form.controls.comment.value,
        }
    }

}
