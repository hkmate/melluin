import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MessageService} from '@fe/app/util/message.service';
import {I18nKeys} from '@fe/app/util/translate/i18n.type';

@Component({
    imports: [MatIconModule],
    selector: 'app-copier',
    templateUrl: './copier.component.html',
    styleUrl: './copier.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopierComponent {

    private readonly msg = inject(MessageService);

    public readonly value = input.required<string>();
    public readonly icon = input('link');
    public readonly disableMsg = input(false);
    public readonly infoMsg = input<I18nKeys>('LinkCopied');

    protected copyLink(): void {
        navigator.clipboard.writeText(this.value());
        if (!this.disableMsg()) {
            this.msg.info(this.infoMsg());
        }
    }

}
