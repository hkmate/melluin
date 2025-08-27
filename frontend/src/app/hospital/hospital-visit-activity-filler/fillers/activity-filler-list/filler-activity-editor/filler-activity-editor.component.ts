import {Component, inject, input, output} from '@angular/core';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';
import {isNotEmptyValidator} from '@fe/app/util/util';
import {HospitalVisitActivityEditInput} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {HospitalVisitActivity} from '@shared/hospital-visit-activity/hospital-visit-activity';
import {VisitedChildById} from '@fe/app/hospital/hospital-visit-activity-filler/model/visited-child-by-id';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-filler-activity-editor',
    templateUrl: './filler-activity-editor.component.html',
    styleUrls: ['./filler-activity-editor.component.scss']
})
export class FillerActivityEditorComponent {

    private readonly formBuilder = inject(FormBuilder);
    private readonly filler = inject(HospitalVisitActivityFillerService);

    public readonly activity = input.required<HospitalVisitActivity>();
    public readonly childrenById = input.required<VisitedChildById>();

    public readonly editDone = output<void>();

    protected children$: Observable<Array<VisitedChild>>;
    protected activityTypeOptions: Array<VisitActivityType> = Object.values(VisitActivityType);
    protected buttonsDisabled: boolean;
    protected form: FormGroup;
    protected visitDate: Date;

    constructor() {
        this.children$ = this.filler.getChildren();
        this.visitDate = this.filler.getVisitDate();
        this.initForm();
    }

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

    private initForm(): void {
        const children = this.activity().children.map(childId => this.childrenById()[childId]);
        this.form = this.formBuilder.group({
            children: [children, [Validators.required, isNotEmptyValidator]],
            activities: [this.activity().activities, [Validators.required, isNotEmptyValidator]],
            comment: [this.activity().comment]
        });
    }

    private createObjectFromForm(): HospitalVisitActivityEditInput {
        return {
            ...this.activity(),
            activities: this.form.controls.activities.value,
            children: this.createActivityChildInfoList(),
            comment: this.form.controls.comment.value
        }
    }

    private createActivityChildInfoList(): Array<string> {
        return (this.form.controls.children.value as Array<VisitedChild>)
            .map(value => value.id);
    }

}
