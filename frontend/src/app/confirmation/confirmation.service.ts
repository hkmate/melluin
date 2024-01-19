import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationAnswer, ConfirmationDialogConfig} from '@fe/app/confirmation/confirmation-dialog-config';
import {ConfirmationDialogComponent} from '@fe/app/confirmation/confirmation-dialog/confirmation-dialog.component';
import {isNilOrEmpty} from '@shared/util/util';


@Injectable()
export class ConfirmationService {

    constructor(private readonly dialog: MatDialog,
                private readonly translate: TranslateService) {
    }

    public getI18nConfirm(configOverride: Partial<ConfirmationDialogConfig>): Promise<void> {
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

    private getDefaultConfigI18nKeys(): ConfirmationDialogConfig {
        return {
            title: 'ConfirmDialog.Title',
            message: '',
            okBtnText: 'OkButton',
            cancelBtnText: 'CancelButton',
        };
    }

    private getTranslatedConfig(config: ConfirmationDialogConfig): ConfirmationDialogConfig {
        return {
            title: isNilOrEmpty(config.title) ? '' : this.translate.instant(config.title),
            message: isNilOrEmpty(config.message) ? '' : this.translate.instant(config.message),
            okBtnText: isNilOrEmpty(config.okBtnText) ? '' : this.translate.instant(config.okBtnText),
            cancelBtnText: isNilOrEmpty(config.cancelBtnText) ? '' : this.translate.instant(config.cancelBtnText),
        };
    }

}
