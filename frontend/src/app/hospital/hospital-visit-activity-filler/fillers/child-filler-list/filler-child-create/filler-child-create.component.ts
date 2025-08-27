import {Component, inject, output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {getGuessedBirthFromYears} from '@shared/child/child-age-calculator';
import {VisitedChildInput} from '@shared/hospital-visit/visited-child';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';

@Component({
    selector: 'app-filler-child-create',
    templateUrl: './filler-child-create.component.html',
    styleUrls: ['./filler-child-create.component.scss']
})
export class FillerChildCreateComponent {

    private static readonly CHILD_AGE_LIMIT = 18;
    private static readonly MAX_MONTH_IN_YEAR = 11;

    private readonly formBuilder = inject(FormBuilder);
    protected readonly filler = inject(HospitalVisitActivityFillerService);

    public readonly creationEnded = output<void>();

    protected buttonsDisabled: boolean;
    protected form: FormGroup;

    constructor() {
        this.initForm();
    }

    protected onFormSubmit(): void {
        this.buttonsDisabled = true;
        this.filler.saveNewChild(this.createObjectFromForm()).subscribe({
            next: () => {
                this.buttonsDisabled = false;
                this.creationEnded.emit();
            },
            error: () => {
                this.buttonsDisabled = false;
            }
        });
    }

    protected cancelEditing(): void {
        this.creationEnded.emit();
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            name: ['', [Validators.required]],
            ageYear: [0, [Validators.required, Validators.pattern('[0-9]*'),
                Validators.min(0), Validators.max(FillerChildCreateComponent.CHILD_AGE_LIMIT)]],
            ageMonth: [0, [Validators.required, Validators.pattern('[0-9]*'),
                Validators.min(0), Validators.max(FillerChildCreateComponent.MAX_MONTH_IN_YEAR)]],
            isParentThere: [false],
            info: []
        })
    }

    private createObjectFromForm(): VisitedChildInput {
        return {
            child: {
                name: this.form.controls.name.value,
                guessedBirth: getGuessedBirthFromYears(this.form.controls.ageYear.value,
                    this.form.controls.ageMonth.value,
                    this.filler.getVisitDate()),
                info: this.form.controls.info.value,
            },
            isParentThere: this.form.controls.isParentThere.value
        }
    }

}
