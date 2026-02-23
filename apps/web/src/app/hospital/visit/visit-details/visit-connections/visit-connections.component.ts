import {Component, inject, input, output, signal} from '@angular/core';
import {Visit, Permission} from '@melluin/common';
import {VisitConnectionsService} from '@fe/app/hospital/visit/visit-details/visit-connections.service';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {PermissionService} from '@fe/app/auth/service/permission.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardContent} from '@angular/material/card';
import {VisitConnectionCreateComponent} from '@fe/app/hospital/visit/visit-details/visit-connections/visit-connection-create/visit-connection-create.component';
import {VisitConnectedVisitComponent} from '@fe/app/hospital/visit/visit-details/visit-connections/visit-connected-visit/visit-connected-visit.component';

@Component({
    selector: 'app-visit-connections',
    templateUrl: './visit-connections.component.html',
    imports: [
        TranslatePipe,
        MatMiniFabButton,
        MatIcon,
        MatCard,
        MatCardContent,
        VisitConnectionCreateComponent,
        VisitConnectedVisitComponent
    ],
    styleUrl: './visit-connections.component.scss'
})
export class VisitConnectionsComponent {

    protected readonly Permission = Permission;

    private readonly confirmService = inject(ConfirmationService);
    private readonly visitConnectionsService = inject(VisitConnectionsService);
    protected readonly permissions = inject(PermissionService);

    public readonly visit = input.required<Visit>();
    public readonly connections = input.required<Array<Visit>>();
    public readonly refreshConnections = output();

    protected creationOpened = signal(false);

    protected toggleCreation(): void {
        this.creationOpened.update(value => !value);
    }

    protected addConnection(connectVisit: Visit): void {
        this.visitConnectionsService.addConnection(this.visit().id, connectVisit.id).subscribe(() => {
            this.creationOpened.set(false);
            this.refreshConnections.emit();
        });
    }

    protected removeConnection(connectedId: string): void {
        this.confirmService.getI18nConfirm({
            message: 'Visit.Connections.DeleteConfirm',
            okBtnText: 'YesNo.true'
        }).then(() => {
            this.visitConnectionsService.deleteConnection(this.visit().id, connectedId).subscribe(() => {
                this.refreshConnections.emit();
            });
        })
    }

}
