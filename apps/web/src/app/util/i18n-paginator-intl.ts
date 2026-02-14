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

    public getRangeLabel(page: number, pageSize: number, total: number): string {
        const pageInfo = {page, totalPages: 0, first: 0, last: 0, total}
        if (total !== 0) {
            pageInfo.totalPages = Math.ceil(total / pageSize);
            pageInfo.first = pageInfo.page * pageSize + 1;
            pageInfo.last = Math.min(pageInfo.first + pageSize, total);
            pageInfo.page++;
        }
        return this.i18n.instant('Paginator.PageOfLabel', pageInfo);
    }

}
