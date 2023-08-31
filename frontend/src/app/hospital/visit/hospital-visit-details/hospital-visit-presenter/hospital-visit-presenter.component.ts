import {Component, Input} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {MessageService} from '@fe/app/util/message.service';

@Component({
    selector: 'app-hospital-visit-presenter',
    templateUrl: './hospital-visit-presenter.component.html',
    styleUrls: ['./hospital-visit-presenter.component.scss']
})
export class HospitalVisitPresenterComponent {

    @Input()
    public visit: HospitalVisit;

    constructor(private readonly msg: MessageService) {
    }

    protected copyLink(): void {
        navigator.clipboard.writeText(window.location.href);
        this.msg.info('LinkCopied')
    }

}
