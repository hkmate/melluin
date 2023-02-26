import {Component, Input} from '@angular/core';
import {HospitalVisitStatus} from '@shared/hospital-visit/hospital-visit-status';
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
    selector: 'app-visit-status-icon',
    templateUrl: './visit-status-icon.component.html',
    styleUrls: ['./visit-status-icon.component.scss'],
    imports: [
        NgSwitch,
        NgSwitchDefault,
        NgSwitchCase,
        MatIconModule
    ],
    standalone: true
})
export class VisitStatusIconComponent {

    @Input()
    public status: HospitalVisitStatus;

}
