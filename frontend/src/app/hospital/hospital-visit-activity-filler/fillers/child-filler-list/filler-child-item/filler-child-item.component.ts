import {Component, Input} from '@angular/core';
import {VisitedChild} from '@shared/hospital-visit/visited-child';
import {HospitalVisitActivityFillerService} from '@fe/app/hospital/hospital-visit-activity-filler/hospital-visit-activity-filler.service';

@Component({
    selector: 'app-filler-child-item',
    templateUrl: './filler-child-item.component.html',
    styleUrls: ['./filler-child-item.component.scss']
})
export class FillerChildItemComponent {

    @Input()
    public child: VisitedChild;

    protected edit= false;

    constructor(private readonly fillerService: HospitalVisitActivityFillerService) {
    }

    protected changeToEdit(): void {
        this.edit = true;
    }

    protected endEdit(): void {
        this.edit = false;
    }

    protected removeChild(): void {
        this.fillerService.removeChild(this.child).subscribe();
    }

}
