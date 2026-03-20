import {inject, Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {t} from '@fe/app/util/translate/translate';
import {I18nKeys} from '@fe/app/util/translate/i18n.type';

@Injectable({providedIn: 'root'})
export class MessageService {

    private readonly toastr = inject(ToastrService);

    public success(msgKey: I18nKeys): void {
        this.successRaw(t(msgKey));
    }

    public warning(msgKey: I18nKeys): void {
        this.warningRaw(t(msgKey));
    }

    public info(msgKey: I18nKeys): void {
        this.infoRaw(t(msgKey));
    }

    public error(msgKey: I18nKeys): void {
        this.errorRaw(t(msgKey));
    }

    public successRaw(msg: string): void {
        this.toastr.success(msg);
    }

    public warningRaw(msg: string): void {
        this.toastr.warning(msg);
    }

    public infoRaw(msg: string): void {
        this.toastr.info(msg);
    }

    public errorRaw(msg: string): void {
        this.toastr.error(msg);
    }

}
