import {Component, inject, input, output} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatMiniFabButton} from '@angular/material/button';
import {PersonNamePipe} from '@fe/app/people/person-name.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {VisitStatusIconComponent} from '@fe/app/hospital/visit/visit-status-icon/visit-status-icon.component';
import {Visit, Permission} from '@melluin/common';
import {RouterLink} from '@angular/router';
import {PermissionService} from '@fe/app/auth/service/permission.service';

@Component({
    imports: [
        DatePipe,
        MatIcon,
        MatMiniFabButton,
        PersonNamePipe,
        TranslateModule,
        VisitStatusIconComponent,
        RouterLink
    ],
    selector: 'app-visit-connected-visit',
    templateUrl: './visit-connected-visit.component.html',
    styleUrl: './visit-connected-visit.component.scss'
})
export class VisitConnectedVisitComponent {

    protected readonly Permission = Permission;

    protected readonly permissions = inject(PermissionService);

    public readonly visit = input.required<Visit>();
    public readonly removeEnable = input(true);
    public readonly delete = output();

}
