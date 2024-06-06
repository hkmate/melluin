import {Component, Input} from '@angular/core';
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

    @Input()
    public value: string;

    @Input()
    public icon: string = 'link'

    @Input()
    public disableMsg: boolean = false;

    constructor(private readonly msg: MessageService) {
    }

    protected copyLink(): void {
        navigator.clipboard.writeText(this.value);
        if (!this.disableMsg) {
            this.msg.info('LinkCopied');
        }
    }

}
