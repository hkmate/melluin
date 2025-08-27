import {inject, Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    private readonly toastr = inject(ToastrService);
    private readonly i18n = inject(TranslateService);


    public success(msgKey: string): void {
        this.successRaw(this.i18n.instant(msgKey));
    }

    public warning(msgKey: string): void {
        this.warningRaw(this.i18n.instant(msgKey));
    }

    public info(msgKey: string): void {
        this.infoRaw(this.i18n.instant(msgKey));
    }

    public error(msgKey: string): void {
        this.errorRaw(this.i18n.instant(msgKey));
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
