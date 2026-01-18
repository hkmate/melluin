import {inject, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {HospitalVisit} from '@shared/hospital-visit/hospital-visit';
import {ContinueOtherVisitDialogComponent} from './continue-other-visit-dialog/continue-other-visit-dialog.component';
import {isNotNil} from '@shared/util/util';


@Injectable()
export class ContinueOtherVisitDialogService {

    private readonly dialog = inject(MatDialog);

    public askContinueInfo(visit: HospitalVisit): Promise<HospitalVisit> {
        return new Promise((resolve, reject) => {
            const dialogRef = this.dialog.open(ContinueOtherVisitDialogComponent, {
                data: visit

            });
            dialogRef.afterClosed().subscribe({
                next: (newVisit: HospitalVisit | null) => (isNotNil(newVisit) ? resolve(newVisit) : reject()),
                error: reject
            });
        });
    }

}
