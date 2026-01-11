import {Component, effect, inject, input, signal} from '@angular/core';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {HospitalVisitConnectionsService} from '@fe/app/hospital/visit/hospital-visit-details/hospital-visit-connections.service';
import {ConfirmationService} from '@fe/app/confirmation/confirmation.service';
import {Permission} from '@shared/user/permission.enum';
import {PermissionService} from '@fe/app/auth/service/permission.service';

@Component({
    selector: 'app-hospital-visit-connections',
    templateUrl: './hospital-visit-connections.component.html',
    styleUrl: './hospital-visit-connections.component.scss'
})
export class HospitalVisitConnectionsComponent {

    protected readonly Permission = Permission;

    private readonly confirmService = inject(ConfirmationService);
    private readonly visitConnectionsService = inject(HospitalVisitConnectionsService);
    protected readonly permissions = inject(PermissionService);

    public visit = input.required<HospitalVisit>();
    public connections = input.required<Array<HospitalVisit>>();
    public connectionsToShow = signal<Array<HospitalVisit>>([]);

    protected creationOpened = signal(false);

    constructor() {
        effect(() => {
            this.connectionsToShow.set(this.connections());
        }, {allowSignalWrites: true});
    }

    protected toggleCreation(): void {
        this.creationOpened.update(value => !value);
    }

    protected addConnection(connectVisit: HospitalVisit): void {
        this.visitConnectionsService.addConnection(this.visit().id, connectVisit.id).subscribe(() => {
            this.creationOpened.set(false);
            this.connectionsToShow.update(prev => [...prev, connectVisit]);
        });
    }

    protected removeConnection(connectedId: string): void {
        this.confirmService.getI18nConfirm({
            message: 'HospitalVisit.Connections.DeleteConfirm',
            okBtnText: 'YesNo.true'
        }).then(() => {
            this.visitConnectionsService.deleteConnection(this.visit().id, connectedId).subscribe(() => {
                this.connectionsToShow.update(prev => prev.filter(visit => visit.id !== connectedId));
            });
        })
    }

}
