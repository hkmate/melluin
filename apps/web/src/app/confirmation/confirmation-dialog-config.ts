import {I18nKeys} from '@fe/app/util/translate/i18n.type';

export interface ConfirmationDialogConfig {

    title: string;
    message?: string;
    okBtnText: string;
    cancelBtnText: string;

}

export type ConfirmationDialogI18nConfig = { [key in keyof ConfirmationDialogConfig]: I18nKeys };

export enum ConfirmationAnswer {
    OK = 'OK', CANCEL = 'CANCEL'
}
