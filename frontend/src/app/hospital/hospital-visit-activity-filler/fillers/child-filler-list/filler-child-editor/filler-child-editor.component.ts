import {Component, inject, input, output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {getGuessedBirthFromYears} from '@shared/child/child-age-calculator';
import {VisitedChild, VisitedChildEditInput} from '@shared/hospital-visit/visited-child';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';

@Component({
    selector: 'app-filler-child-editor',
    templateUrl: './filler-child-editor.component.html',
    styleUrls: ['./filler-child-editor.component.scss']
})
export class FillerChildEditorComponent {

    private static readonly CHILD_AGE_LIMIT = 18;
    private static readonly MAX_MONTH_IN_YEAR = 11;

    private readonly formBuilder = inject(FormBuilder);
    protected readonly filler = inject(HospitalVisitActivityFillerService);

    public readonly visitedChild = input.required<VisitedChild>();

    public readonly editDone = output<void>();

    protected buttonsDisabled: boolean;
    protected form: FormGroup;

    constructor() {
        this.initForm();
    }

    protected cancelEditing(): void {
        this.editDone.emit();
    }

    protected onFormSubmit(): void {
        this.buttonsDisabled = true;
        this.filler.updateChild(this.createObjectFromForm()).subscribe({
            next: () => {
                this.buttonsDisabled = false;
                this.editDone.emit();
            },
            error: () => {
                this.buttonsDisabled = false;
            }
        });
    }

    private initForm(): void {
        const {years, months} = this.filler.childAge(this.visitedChild().child);
        this.form = this.formBuilder.group({
            name: [this.visitedChild().child.name, [Validators.required]],
            ageYear: [years, [Validators.required, Validators.pattern('[0-9]*'),
                Validators.min(0), Validators.max(FillerChildEditorComponent.CHILD_AGE_LIMIT)]],
            ageMonth: [months, [Validators.required, Validators.pattern('[0-9]*'),
                Validators.min(0), Validators.max(FillerChildEditorComponent.MAX_MONTH_IN_YEAR)]],
            isParentThere: [this.visitedChild().isParentThere],
            info: [this.visitedChild().child.info]
        })
    }

    private createObjectFromForm(): VisitedChildEditInput {
        return {
            id: this.visitedChild().id,
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
