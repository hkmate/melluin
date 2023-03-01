import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {getGuessedBirthFromYears} from '@shared/child/child-age-calculator';
import {PatientChildInput} from '@shared/child/patient-child';

@Component({
    selector: 'app-child-create',
    templateUrl: './child-create.component.html',
    styleUrls: ['./child-create.component.scss']
})
export class ChildCreateComponent {

    private static readonly CHILD_AGE_LIMIT = 18;

    @Input()
    public buttonsDisabled: boolean;

    @Input()
    public needParentInfo: boolean;

    @Input()
    public visitDate: Date;

    @Output()
    public submitted = new EventEmitter<PatientChildInput>();

    @Output()
    public canceled = new EventEmitter<void>();

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

    private initForm(): void {
        this.form = this.formBuilder.group({
            name: ['', [Validators.required]],
            age: [0, [Validators.required, Validators.min(0), Validators.max(ChildCreateComponent.CHILD_AGE_LIMIT)]],
            isParentThere: [false],
            info: []
        })
    }

    private createObjectFromForm(): PatientChildInput {
        return {
            child: {
                name: this.form.controls.name.value,
                guessedBirth: getGuessedBirthFromYears(this.form.controls.age.value, this.visitDate),
                info: this.form.controls.info.value,
            },
            isParentThere: this.form.controls.isParentThere.value
        }
    }

}
