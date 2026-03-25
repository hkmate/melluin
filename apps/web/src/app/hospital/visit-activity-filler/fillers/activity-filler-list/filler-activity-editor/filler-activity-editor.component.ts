import {ChangeDetectionStrategy, Component, effect, inject, input, output, signal} from '@angular/core';
import {
    isNil,
    VisitActivity,
    VisitActivityEditInput,
    VisitActivityInput,
    VisitActivityType,
    VisitActivityTypes,
    VisitedChild
} from '@melluin/common';
import {ReactiveFormsModule} from '@angular/forms';
import {VisitedChildById} from '@fe/app/hospital/visit-activity-filler/model/visited-child-by-id';
import {MatCard, MatCardContent} from '@angular/material/card';
import {ChildSelectComponent} from '@fe/app/hospital/child/child-select/child-select.component';
import {TranslatePipe} from '@ngx-translate/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {ActivitySelectComponent} from '@fe/app/hospital/visit-activity-filler/fillers/activity-select/activity-select.component';
import {VisitActivityFillerFactory} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.factory';
import {form, FormField, minLength, required, submit} from '@angular/forms/signals';
import {t} from '@fe/app/util/translate/translate';
import {firstValueFrom} from 'rxjs';
import {AppSubmit} from '@fe/app/util/submit/app-submit';

@Component({
    imports: [
        MatCard,
        MatCardContent,
        ReactiveFormsModule,
        ChildSelectComponent,
        TranslatePipe,
        ActivitySelectComponent,
        MatFormField,
        MatLabel,
        MatInput,
        MatButton,
        AppSubmit,
        FormField,
        ChildSelectComponent
    ],
    selector: 'app-filler-activity-editor',
    templateUrl: './filler-activity-editor.component.html',
    styleUrls: ['./filler-activity-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FillerActivityEditorComponent {

    protected readonly activityTypeOptions: Array<VisitActivityType> = Object.values(VisitActivityTypes);

    private readonly filler = inject(VisitActivityFillerFactory).getService();

    public readonly activity = input<VisitActivity>();
    public readonly childrenById = input.required<VisitedChildById>();

    public readonly editDone = output<void>();

    protected readonly visitDate = this.filler.getVisitDate();
    protected readonly children = this.filler.getChildren();

    private readonly formModel = signal(this.getDefaultFormModel());
    protected readonly form = form(this.formModel, schema => {
        required(schema.children, {message: t('Form.Required')});
        minLength(schema.children, 1, {message: t('Form.Min', {min: 1})});

        required(schema.activities, {message: t('Form.Required')});
        minLength(schema.activities, 1, {message: t('Form.Min', {min: 1})});
    });

    constructor() {
        effect(() => this.setupFormInput());
    }

    protected submitForm(): void {
        submit(this.form, async () => {
            const saved = await this.saveActivity();
            this.filler.unlockVisitedChildId(...saved.children);
            this.cancelEditing();
        });
    }

    protected lockChildren(newChildren: Array<VisitedChild>): void {
        this.filler.lockVisitedChildId(...newChildren.map(c => c.id));
    }

    protected unlockChildren(removedChildren: Array<VisitedChild>): void {
        this.filler.unlockVisitedChildId(...removedChildren.map(c => c.id));
    }

    protected cancelEditing(): void {
        this.editDone.emit();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private getDefaultFormModel() {
        return {
            children: [] as Array<VisitedChild>,
            activities: [] as Array<VisitActivityType>,
            comment: '',
        };
    }

    private setupFormInput(): void {
        const activity = this.activity();
        if (isNil(activity)) {
            this.formModel.set(this.getDefaultFormModel());
            return;
        }

        const {activities, comment} = activity;
        const children = activity.children.map(childId => this.childrenById()[childId]);
        this.formModel.set({activities, comment, children});
    }

    private saveActivity(): Promise<VisitActivity> {
        const visitedChildToSave = this.generateDto();
        if ('id' in visitedChildToSave) {
            return firstValueFrom(this.filler.updateActivity(visitedChildToSave));
        }
        return firstValueFrom(this.filler.saveNewActivity(visitedChildToSave));
    }

    private generateDto(): VisitActivityInput | VisitActivityEditInput {
        const existing = this.activity();
        const {children, activities, comment} = this.form().value();
        const obj = {
            comment, activities,
            children: children.map(ch => ch.id),
        } satisfies VisitActivityInput

        if (isNil(existing)) {
            return obj;
        }
        return {...obj, id: existing.id};
    }

}
