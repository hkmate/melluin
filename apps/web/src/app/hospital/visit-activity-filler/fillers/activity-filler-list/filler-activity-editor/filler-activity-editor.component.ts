import {ChangeDetectionStrategy, Component, computed, inject, input, output} from '@angular/core';
import {
    UUID,
    VisitActivity,
    VisitActivityEditInput,
    VisitActivityType,
    VisitActivityTypes,
    VisitedChild
} from '@melluin/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {VisitedChildById} from '@fe/app/hospital/visit-activity-filler/model/visited-child-by-id';
import {MatCard, MatCardContent} from '@angular/material/card';
import {ChildSelectComponent} from '@fe/app/hospital/child/child-select/child-select.component';
import {TranslatePipe} from '@ngx-translate/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {isNotEmptyValidator} from '@fe/app/util/is-not-empty-validator';
import {ActivitySelectComponent} from '@fe/app/hospital/visit-activity-filler/fillers/activity-select/activity-select.component';
import {VisitActivityFillerFactory} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.factory';

@Component({
    selector: 'app-filler-activity-editor',
    templateUrl: './filler-activity-editor.component.html',
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
        MatButton
    ],
    styleUrls: ['./filler-activity-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FillerActivityEditorComponent {

    protected readonly activityTypeOptions: Array<VisitActivityType> = Object.values(VisitActivityTypes);

    private readonly formBuilder = inject(FormBuilder);
    private readonly filler = inject(VisitActivityFillerFactory).getService();

    public readonly activity = input.required<VisitActivity>();
    public readonly childrenById = input.required<VisitedChildById>();

    public readonly editDone = output<void>();

    protected readonly visitDate = this.filler.getVisitDate();
    protected readonly children = this.filler.getChildren();
    protected buttonsDisabled: boolean;
    protected readonly form = computed(() => this.initForm());

    protected onFormSubmit(): void {
        this.buttonsDisabled = true;
        const updateObj = this.createObjectFromForm();
        this.filler.updateActivity(updateObj).subscribe({
            next: () => {
                this.buttonsDisabled = false;
                this.filler.unlockVisitedChildId(...updateObj.children);
                this.editDone.emit();
            },
            error: () => {
                this.buttonsDisabled = false;
            }
        });
    }

    protected cancelEditing(): void {
        this.editDone.emit();
    }

    protected lockChildren(newChildren: Array<VisitedChild>): void {
        this.filler.lockVisitedChildId(...newChildren.map(c => c.id));
    }

    protected unlockChildren(removedChildren: Array<VisitedChild>): void {
        this.filler.unlockVisitedChildId(...removedChildren.map(c => c.id));
    }

    private initForm(): FormGroup {
        const children = this.activity().children.map(childId => this.childrenById()[childId]);
        return this.formBuilder.group({
            children: [children, [Validators.required, isNotEmptyValidator]],
            activities: [this.activity().activities, [Validators.required, isNotEmptyValidator]],
            comment: [this.activity().comment]
        });
    }

    private createObjectFromForm(): VisitActivityEditInput {
        return {
            ...this.activity(),
            activities: this.form().controls.activities.value,
            children: this.createActivityChildInfoList(),
            comment: this.form().controls.comment.value
        }
    }

    private createActivityChildInfoList(): Array<UUID> {
        return (this.form().controls.children.value as Array<VisitedChild>)
            .map(value => value.id);
    }

}
