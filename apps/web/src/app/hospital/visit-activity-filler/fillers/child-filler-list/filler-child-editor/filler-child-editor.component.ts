import {ChangeDetectionStrategy, Component, computed, inject, input, output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {getGuessedBirthFromYears, VisitedChild, VisitedChildEditInput} from '@melluin/common';
import {MatCard, MatCardContent} from '@angular/material/card';
import {TrimmedTextInputComponent} from '@fe/app/util/trimmed-text-input/trimmed-text-input.component';
import {TranslatePipe} from '@ngx-translate/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {VisitActivityFillerFactory} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.factory';

@Component({
    selector: 'app-filler-child-editor',
    templateUrl: './filler-child-editor.component.html',
    imports: [
        MatCard,
        MatCardContent,
        ReactiveFormsModule,
        TrimmedTextInputComponent,
        TranslatePipe,
        MatFormField,
        MatLabel,
        MatInput,
        MatCheckbox,
        MatButton
    ],
    styleUrls: ['./filler-child-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FillerChildEditorComponent {

    private static readonly CHILD_AGE_LIMIT = 18;
    private static readonly MAX_MONTH_IN_YEAR = 11;

    private readonly formBuilder = inject(FormBuilder);
    protected readonly filler = inject(VisitActivityFillerFactory).getService();

    public readonly visitedChild = input.required<VisitedChild>();

    public readonly editDone = output<void>();

    protected buttonsDisabled: boolean;
    protected readonly form = computed(() => this.initForm());

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

    private initForm(): FormGroup {
        const {years, months} = this.filler.childAge(this.visitedChild().child);
        return this.formBuilder.group({
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
