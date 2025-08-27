import {Component, inject, output} from '@angular/core';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {HospitalVisitActivityInput} from '@shared/hospital-visit-activity/hospital-visit-activity-input';
import {VisitActivityType} from '@shared/hospital-visit-activity/visit-activity-type';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isNotEmptyValidator} from '@fe/app/util/util';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-filler-activity-create',
    templateUrl: './filler-activity-create.component.html',
    styleUrls: ['./filler-activity-create.component.scss']
})
export class FillerActivityCreateComponent {

    private readonly formBuilder = inject(FormBuilder);
    private readonly filler = inject(HospitalVisitActivityFillerService);

    public readonly creationEnded = output<void>();

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

    private initForm(): void {
        this.form = this.formBuilder.group({
            children: [[], [Validators.required, isNotEmptyValidator]],
            activities: [[], [Validators.required, isNotEmptyValidator]],
            comment: []
        })
    }

    private createObjectFromForm(): HospitalVisitActivityInput {
        return {
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
