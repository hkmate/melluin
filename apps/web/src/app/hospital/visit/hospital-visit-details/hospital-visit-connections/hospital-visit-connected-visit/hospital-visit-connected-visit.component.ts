import {Component, inject, input, output} from '@angular/core';
import {DatePipe, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatMiniFabButton} from '@angular/material/button';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {VisitStatusIconComponent} from '@fe/app/hospital/visit/visit-status-icon/visit-status-icon.component';
import {Permission} from '@shared/user/permission.enum';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {RouterLink} from '@angular/router';
import {PermissionService} from '@fe/app/auth/service/permission.service';

@Component({
    selector: 'app-hospital-visit-connected-visit',
    standalone: true,
    imports: [
        DatePipe,
        MatIcon,
        MatMiniFabButton,
        NgIf,
        PersonNamePipe,
        TranslateModule,
        VisitStatusIconComponent,
        RouterLink
    ],
    templateUrl: './hospital-visit-connected-visit.component.html',
    styleUrl: './hospital-visit-connected-visit.component.scss'
})
export class HospitalVisitConnectedVisitComponent {

    protected readonly Permission = Permission;

    protected readonly permissions = inject(PermissionService);

    public readonly visit = input.required<HospitalVisit>();
    public readonly removeEnable = input(true);
    public readonly delete = output();

}
