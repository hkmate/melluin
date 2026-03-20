import {Component, inject, output, signal} from '@angular/core';
import {UUID, VisitActivityInput, VisitActivityType, VisitActivityTypes, VisitedChild} from '@melluin/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {VisitActivityFillerService} from '@fe/app/hospital/visit-activity-filler/visit-activity-filler.service';
import {Observable} from 'rxjs';
import {MatCard, MatCardContent} from '@angular/material/card';
import {ChildSelectComponent} from '@fe/app/hospital/child/child-select/child-select.component';
import {AsyncPipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {ActivitySelectComponent} from '@fe/app/hospital/visit-activity/activity-select/activity-select.component';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {isNotEmptyValidator} from '@fe/app/util/is-not-empty-validator';

@Component({
    selector: 'app-filler-activity-create',
    templateUrl: './filler-activity-create.component.html',
    imports: [
        MatCard,
        MatCardContent,
        ReactiveFormsModule,
        ChildSelectComponent,
        AsyncPipe,
        TranslatePipe,
        ActivitySelectComponent,
        MatLabel,
        MatFormField,
        MatInput,
        MatButton
    ],
    styleUrls: ['./filler-activity-create.component.scss']
})
export class FillerActivityCreateComponent {

    private readonly formBuilder = inject(FormBuilder);
    private readonly filler = inject(VisitActivityFillerService);

    public readonly creationEnded = output<void>();

    protected children$: Observable<Array<VisitedChild>>;
    protected activityTypeOptions: Array<VisitActivityType> = Object.values(VisitActivityTypes);
    protected buttonsDisabled: boolean;
    protected readonly form = signal(this.initForm());
    protected visitDate: Date;

    constructor() {
        this.children$ = this.filler.getChildren();
        this.visitDate = this.filler.getVisitDate();
    }

    protected onFormSubmit(): void {
        this.buttonsDisabled = true;
        const creationObject = this.createObjectFromForm();
        this.filler.saveNewActivity(creationObject).subscribe({
            next: () => {
                this.buttonsDisabled = false;
                this.filler.unlockVisitedChildId(...creationObject.children);
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

    protected lockChildren(newChildren: Array<VisitedChild>): void {
        this.filler.lockVisitedChildId(...newChildren.map(c => c.id));
    }

    protected unlockChildren(removedChildren: Array<VisitedChild>): void {
        this.filler.unlockVisitedChildId(...removedChildren.map(c => c.id));
    }

    private initForm(): FormGroup {
        return this.formBuilder.group({
            children: [[], [Validators.required, isNotEmptyValidator]],
            activities: [[], [Validators.required, isNotEmptyValidator]],
            comment: []
        })
    }

    private createObjectFromForm(): VisitActivityInput {
        return {
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
