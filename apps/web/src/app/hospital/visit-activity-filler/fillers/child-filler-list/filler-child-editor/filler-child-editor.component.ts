import {ChangeDetectionStrategy, Component, effect, inject, input, output, signal} from '@angular/core';
import {getGuessedBirthFromYears, isNil, VisitedChild, VisitedChildEditInput, VisitedChildInput} from '@melluin/common';
import {MatCard, MatCardContent} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {VisitActivityFillerFactory} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.factory';
import {form, FormField, max, min, required, submit} from '@angular/forms/signals';
import {t} from '@fe/app/util/translate/translate';
import {noWhitespaceHeadOrTail} from '@fe/app/util/whitespace-validator/no-whitespace-head-or-tail';
import {firstValueFrom} from 'rxjs';
import {AppSubmit} from '@fe/app/util/submit/app-submit';
import {MelluinMatErrorComponent} from '@fe/app/util/melluin-mat-error/melluin-mat-error.component';

const CHILD_AGE_LIMIT = 18;
const MAX_MONTH_IN_YEAR = 11;

@Component({
    imports: [
        MatCard,
        MatCardContent,
        TranslatePipe,
        MatFormField,
        MatLabel,
        MatInput,
        MatCheckbox,
        MatButton,
        AppSubmit,
        MatError,
        MelluinMatErrorComponent,
        FormField
    ],
    selector: 'app-filler-child-editor',
    templateUrl: './filler-child-editor.component.html',
    styleUrls: ['./filler-child-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FillerChildEditorComponent {

    protected readonly filler = inject(VisitActivityFillerFactory).getService();

    public readonly visitedChild = input<VisitedChild>();
    public readonly editDone = output<void>();

    private readonly formModel = signal(this.getDefaultFormModel());
    protected readonly form = form(this.formModel, schema => {
        required(schema.name, {message: t('Form.Required')});
        noWhitespaceHeadOrTail(schema.name);

        required(schema.ageYear, {message: t('Form.Required')});
        min(schema.ageYear, 0, {message: t('Form.Min', {min: 0})});
        max(schema.ageYear, CHILD_AGE_LIMIT, {message: t('Form.Max', {max: CHILD_AGE_LIMIT})});

        required(schema.ageMonth, {message: t('Form.Required')});
        min(schema.ageMonth, 0, {message: t('Form.Min', {min: 0})});
        max(schema.ageMonth, MAX_MONTH_IN_YEAR, {message: t('Form.Max', {max: MAX_MONTH_IN_YEAR})});
    });

    constructor() {
        effect(() => this.setupFormInput());
    }

    protected submitForm(): void {
        submit(this.form, async () => {
            await this.saveChild();
            this.cancelEditing();
        });
    }

    protected cancelEditing(): void {
        this.editDone.emit();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private getDefaultFormModel() {
        return {
            name: '',
            ageYear: 0,
            ageMonth: 0,
            isParentThere: false,
            info: ''
        };
    }

    private setupFormInput(): void {
        const visitedChild = this.visitedChild();
        if (isNil(visitedChild)) {
            this.formModel.set(this.getDefaultFormModel());
            return;
        }
        const {child, isParentThere} = visitedChild;
        const {years, months} = this.filler.childAge(child);
        this.formModel.set({
            name: child.name,
            ageYear: years,
            ageMonth: months,
            isParentThere: isParentThere,
            info: child.info ?? ''
        });
    }

    private saveChild(): Promise<VisitedChild> {
        const visitedChildToSave = this.generateDto();
        if ('id' in visitedChildToSave) {
            return firstValueFrom(this.filler.updateChild(visitedChildToSave));
        }
        return firstValueFrom(this.filler.saveNewChild(visitedChildToSave));
    }

    private generateDto(): VisitedChildInput | VisitedChildEditInput {
        const existing = this.visitedChild();
        const formValue = this.form().value();
        const visitDate = this.filler.getVisitDate()();
        const obj = {
            isParentThere: formValue.isParentThere,
            child: {
                name: formValue.name,
                guessedBirth: getGuessedBirthFromYears(formValue.ageYear, formValue.ageMonth, visitDate),
                info: formValue.info
            }
        } satisfies VisitedChildInput

        if (isNil(existing)) {
            return obj;
        }
        return {...obj, id: existing.id};
    }

}
