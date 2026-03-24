import {ChangeDetectionStrategy, Component, inject, output, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {getGuessedBirthFromYears, VisitedChildInput} from '@melluin/common';
import {MatCard, MatCardContent} from '@angular/material/card';
import {TrimmedTextInputComponent} from '@fe/app/util/trimmed-text-input/trimmed-text-input.component';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {VisitActivityFillerFactory} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.factory';

@Component({
    selector: 'app-filler-child-create',
    templateUrl: './filler-child-create.component.html',
    imports: [
        MatCard,
        MatCardContent,
        ReactiveFormsModule,
        TrimmedTextInputComponent,
        MatFormField,
        MatLabel,
        TranslatePipe,
        MatInput,
        MatCheckbox,
        MatButton
    ],
    styleUrls: ['./filler-child-create.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FillerChildCreateComponent {

    private static readonly CHILD_AGE_LIMIT = 18;
    private static readonly MAX_MONTH_IN_YEAR = 11;

    private readonly formBuilder = inject(FormBuilder);
    protected readonly filler = inject(VisitActivityFillerFactory).getService();

    public readonly creationEnded = output<void>();

    protected buttonsDisabled: boolean;
    protected readonly form = signal(this.initForm());


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

    private initForm(): FormGroup {
        return this.formBuilder.group({
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
                name: this.form().controls.name.value,
                guessedBirth: getGuessedBirthFromYears(this.form().controls.ageYear.value,
                    this.form().controls.ageMonth.value,
                    this.filler.getVisitDate()()),
                info: this.form().controls.info.value,
            },
            isParentThere: this.form().controls.isParentThere.value
        }
    }

}
