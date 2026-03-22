import {ChangeDetectionStrategy, Component, inject, input, output, signal} from '@angular/core';
import {Permission, UUID, Visit} from '@melluin/common';
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
    imports: [
        TranslatePipe,
        MatMiniFabButton,
        MatIcon,
        MatCard,
        MatCardContent,
        VisitConnectionCreateComponent,
        VisitConnectedVisitComponent
    ],
    selector: 'app-visit-connections',
    templateUrl: './visit-connections.component.html',
    styleUrl: './visit-connections.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
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

    protected removeConnection(connectedId: UUID): void {
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
