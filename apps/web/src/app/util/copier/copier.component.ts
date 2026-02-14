import {Component, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MessageService} from '@fe/app/util/message.service';

@Component({
    selector: 'app-copier',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './copier.component.html',
    styleUrl: './copier.component.scss'
})
export class CopierComponent {

    private readonly msg = inject(MessageService);

    public readonly value = input.required<string>();
    public readonly icon = input('link');
    public readonly disableMsg = input(false);
    public readonly infoMsg = input('LinkCopied');

    protected copyLink(): void {
        navigator.clipboard.writeText(this.value());
        if (!this.disableMsg()) {
            this.msg.info(this.infoMsg());
        }
    }

}
