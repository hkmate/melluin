import {ChangeDetectionStrategy, Component, effect, inject, input, signal} from '@angular/core';
import {
    BoxStatusChangeReason,
    BoxStatusWithDepartmentBrief,
    dateIntervalGeneratorFactory,
    DateIntervalSpecifier,
    FilterOperationBuilder,
    PageQuery
} from '@melluin/common';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {defaultTo} from 'lodash-es';

@Component({
    imports: [
        MatCard,
        MatCardHeader,
        MatCardSubtitle,
        MatCardContent,
        TranslatePipe,
        RouterLink,
        DatePipe
    ],
    selector: 'app-box-info-widget',
    templateUrl: './box-info-widget.component.html',
    styleUrl: './box-info-widget.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxInfoWidgetComponent {

    private static readonly defaultDateInterval = DateIntervalSpecifier.LAST_MONTH;
    private static readonly defaultReasons = Object.values(BoxStatusChangeReason).filter(r => r !== BoxStatusChangeReason.CORRECTED);
    private static readonly defaultLimit = 10;

    private readonly boxService = inject(DepartmentBoxService)

    public readonly dateInterval = input<DateIntervalSpecifier>()
    public readonly reasons = input<Array<BoxStatusChangeReason>>();
    public readonly limit = input<number>();

    protected readonly boxInfo = signal<Array<BoxStatusWithDepartmentBrief>>([]);

    constructor() {
        effect(() => this.loadBoxInfo());
    }

    private loadBoxInfo(): void {
        this.boxService.findBoxStatuses(this.generatePageQuery()).subscribe(statusPage => {
            this.boxInfo.set(statusPage.items);
        });
    }

    private generatePageQuery(): PageQuery {
        const startDate = dateIntervalGeneratorFactory(
            defaultTo(this.dateInterval(), BoxInfoWidgetComponent.defaultDateInterval)).generate().dateFrom;
        return {
            page: 1,
            size: defaultTo(this.limit(), BoxInfoWidgetComponent.defaultLimit),
            where: {
                'dateTime': FilterOperationBuilder.gte(startDate),
                'reason': FilterOperationBuilder.in(defaultTo(this.reasons(), BoxInfoWidgetComponent.defaultReasons))
            },
            sort: {dateTime: 'DESC'}
        };
    }

}
