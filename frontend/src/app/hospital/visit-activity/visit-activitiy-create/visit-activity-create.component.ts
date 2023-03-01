import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PatientChild} from '@shared/child/patient-child';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';
import {
    ActivityChildInfo,
    HospitalVisitActivityInput
} from '@shared/hospital-visit-activity/hospital-visit-activity-input';

@Component({
    selector: 'app-visit-activity-create',
    templateUrl: './visit-activity-create.component.html',
    styleUrls: ['./visit-activity-create.component.scss']
})
export class VisitActivityCreateComponent {

    @Input()
    public buttonsDisabled: boolean;

    @Input()
    public children: Array<PatientChild>;

    @Output()
    public submitted = new EventEmitter<HospitalVisitActivityInput>();

    @Output()
    public canceled = new EventEmitter<void>();

    protected activityTypeOptions = Object.values(VisitActivityType);
    protected form: FormGroup;

    constructor(private readonly formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.initForm();
    }

    protected onFormSubmit(): void {
        this.submitted.emit(this.createObjectFromForm());
    }

    protected cancelEditing(): void {
        this.canceled.emit();
    }

    protected removeChild(patientInfo: PatientChild): void {
        this.form.controls.children.setValue(
            this.form.controls.children.value.filter(childInfo => childInfo.child.id !== patientInfo.child.id)
        );
    }

    protected removeActivity(activityToRemove: VisitActivityType): void {
        this.form.controls.activities.setValue(
            this.form.controls.activities.value.filter(activity => activity !== activityToRemove)
        );
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            children: [[], [Validators.required]],
            activities: [[], [Validators.required]],
            comment: []
        })
    }

    private createObjectFromForm(): HospitalVisitActivityInput {
        return {
            activities: this.form.controls.activities.value,
            comment: this.form.controls.comment.value,
            children: this.createActivityChildInfoList()
        }
    }

    private createActivityChildInfoList(): Array<ActivityChildInfo> {
        return (this.form.controls.children.value as Array<PatientChild>)
            .map(value => ({childId: value.child.id, isParentThere: Boolean(value.isParentThere)}));
    }

}
