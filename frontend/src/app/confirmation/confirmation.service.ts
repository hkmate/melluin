import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationAnswer, ConfirmationDialogConfig} from '@fe/app/confirmation/confirmation-dialog-config';
import {ConfirmationDialogComponent} from '@fe/app/confirmation/confirmation-dialog/confirmation-dialog.component';


@Injectable()
export class ConfirmationService {

    constructor(private readonly dialog: MatDialog,
                private readonly translate: TranslateService) {
    }

    // eslint-disable-next-line max-lines-per-function
    public getConfirm(configOverride: Partial<ConfirmationDialogConfig>): Promise<void> {
        const config = {
            ...this.getDefaultConfig(),
            ...configOverride
        };

        return new Promise((resolve, reject) => {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                data: config
            });
            dialogRef.afterClosed().subscribe({
                next: (answer: ConfirmationAnswer) => (answer === ConfirmationAnswer.OK ? resolve() : reject()),
                error: () => reject(),
                complete: () => resolve()
            });
        })
    }

    private getDefaultConfig(): ConfirmationDialogConfig {
        return {
            title: this.translate.instant('ConfirmDialog.Title'),
            message: '',
            okBtnText: this.translate.instant('OkButton'),
            cancelBtnText: this.translate.instant('CancelButton'),
        };
    }

}
