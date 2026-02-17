import {inject, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Visit, isNotNil} from '@melluin/common';
import {ContinueOtherVisitDialogComponent} from './continue-other-visit-dialog/continue-other-visit-dialog.component';


@Injectable()
export class ContinueOtherVisitDialogService {

    private readonly dialog = inject(MatDialog);

    public askContinueInfo(visit: Visit): Promise<Visit> {
        return new Promise((resolve, reject) => {
            const dialogRef = this.dialog.open(ContinueOtherVisitDialogComponent, {
                data: visit

            });
            dialogRef.afterClosed().subscribe({
                next: (newVisit: Visit | null) => (isNotNil(newVisit) ? resolve(newVisit) : reject()),
                error: reject
            });
        });
    }

}
