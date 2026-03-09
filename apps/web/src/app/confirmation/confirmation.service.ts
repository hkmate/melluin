import {inject, Injectable} from '@angular/core';
import {
    ConfirmationAnswer,
    ConfirmationDialogConfig,
    ConfirmationDialogI18nConfig
} from '@fe/app/confirmation/confirmation-dialog-config';
import {ConfirmationDialogComponent} from '@fe/app/confirmation/confirmation-dialog/confirmation-dialog.component';
import {isNil} from '@melluin/common';
import {MatDialog} from '@angular/material/dialog';
import {t} from '@fe/app/util/translate/translate';


@Injectable({providedIn: 'root'})
export class ConfirmationService {

    private readonly dialog = inject(MatDialog);

    public getI18nConfirm(configOverride: Partial<ConfirmationDialogI18nConfig>): Promise<void> {
        const config = this.getTranslatedConfig({
            ...this.getDefaultConfigI18nKeys(),
            ...configOverride
        });

        return this.getConfirm(config);
    }

    // eslint-disable-next-line max-lines-per-function
    public getConfirm(configOverride: Partial<ConfirmationDialogConfig>): Promise<void> {
        const config = {
            ...this.getTranslatedConfig(this.getDefaultConfigI18nKeys()),
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
        });
    }

    private getDefaultConfigI18nKeys(): ConfirmationDialogI18nConfig {
        return {
            title: 'ConfirmDialog.Title',
            okBtnText: 'OkButton',
            cancelBtnText: 'CancelButton',
        };
    }

    private getTranslatedConfig(config: ConfirmationDialogI18nConfig): ConfirmationDialogConfig {
        return {
            title: isNil(config.title) ? '' : t(config.title),
            message: isNil(config.message) ? '' : t(config.message),
            okBtnText: isNil(config.okBtnText) ? '' : t(config.okBtnText),
            cancelBtnText: isNil(config.cancelBtnText) ? '' : t(config.cancelBtnText),
        };
    }

}
