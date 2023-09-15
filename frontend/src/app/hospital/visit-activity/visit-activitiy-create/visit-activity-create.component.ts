import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';
import {HospitalVisitActivityInput} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {isNotEmptyValidator} from '@fe/app/util/util';
import {VisitedChild} from '@shared/hospital-visit/visited-child';

@Component({
    selector: 'app-visit-activity-create',
    templateUrl: './visit-activity-create.component.html',
    styleUrls: ['./visit-activity-create.component.scss']
})
export class VisitActivityCreateComponent {

    @Input()
    public buttonsDisabled: boolean;

    @Input()
    public children: Array<VisitedChild>;

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

    protected removeChild(visitedChild: VisitedChild): void {
        this.form.controls.children.setValue(
            this.form.controls.children.value.filter((childInfo: VisitedChild) => childInfo.id !== visitedChild.id)
        );
    }

    protected removeActivity(activityToRemove: VisitActivityType): void {
        this.form.controls.activities.setValue(
            this.form.controls.activities.value.filter((activity: VisitActivityType) => activity !== activityToRemove)
        );
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            children: [[], [Validators.required, isNotEmptyValidator]],
            activities: [[], [Validators.required, isNotEmptyValidator]],
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

    private createActivityChildInfoList(): Array<string> {
        return (this.form.controls.children.value as Array<VisitedChild>)
            .map(value => value.id);
    }

}
