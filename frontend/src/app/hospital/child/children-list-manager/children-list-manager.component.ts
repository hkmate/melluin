import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ChildService} from '@fe/app/hospital/child/child.service';
import {PatientChild, PatientChildInput} from '@shared/child/patient-child';

@Component({
    selector: 'app-children-list-manager',
    templateUrl: './children-list-manager.component.html',
    styleUrls: ['./children-list-manager.component.scss']
})
export class ChildrenListManagerComponent {

    @Input()
    public visitDate: Date;

    @Input()
    public editEnabled: boolean;

    @Input()
    public needParentInfo: boolean;

    @Input()
    public children: Array<PatientChild>;

    @Output()
    public childrenChange = new EventEmitter<Array<PatientChild>>();

    protected creatingInProcess = false;
    protected saveInProcess = false;

    constructor(private readonly childService: ChildService) {
    }

    protected creatorToggled(): void {
        this.creatingInProcess = !this.creatingInProcess;
    }

    protected createCanceled(): void {
        this.creatingInProcess = false;
    }

    protected createFinished(objectToSave: PatientChildInput): void {
        this.saveInProcess = true;
        this.childService.add(objectToSave.child).subscribe(saved => {
            this.children.push({child: saved, isParentThere: objectToSave.isParentThere});
            this.childrenChange.emit(this.children);
            this.creatingInProcess = false;
            this.saveInProcess = false;
        });
    }

}
