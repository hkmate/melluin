import {Injectable} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class I18nPaginatorIntl implements MatPaginatorIntl {

    public changes = new Subject<void>();
    public firstPageLabel: string;
    public itemsPerPageLabel: string;
    public lastPageLabel: string;
    public nextPageLabel: string;
    public previousPageLabel: string;

    constructor(private readonly i18n: TranslateService) {
        this.firstPageLabel = this.i18n.instant('Paginator.FirstPageLabel');
        this.itemsPerPageLabel = this.i18n.instant('Paginator.ItemsPerPageLabel');
        this.lastPageLabel = this.i18n.instant('Paginator.LastPageLabel');
        this.nextPageLabel = this.i18n.instant('Paginator.NextPageLabel');
        this.previousPageLabel = this.i18n.instant('Paginator.PreviousPageLabel');
    }

    public getRangeLabel(page: number, pageSize: number, length: number): string {
        /* eslint-disable @typescript-eslint/no-magic-numbers*/
        if (length === 0) {
            return this.i18n.instant('Paginator.PageOfLabel', {page: 0, count: 0});
        }
        const amountPages = Math.ceil(length / pageSize);
        return this.i18n.instant('Paginator.PageOfLabel', {page: page + 1, count: amountPages});
        /* eslint-enable */
    }

}
