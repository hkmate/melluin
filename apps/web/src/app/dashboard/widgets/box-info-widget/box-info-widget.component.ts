import {Component, effect, inject, input} from '@angular/core';
import {
    BoxStatusChangeReason,
    BoxStatusWithDepartmentBrief,
    dateIntervalGeneratorFactory,
    DateIntervalSpecifier,
    FilterOperationBuilder,
    PageQuery
} from '@melluin/common';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import _ from 'lodash';

@Component({
    selector: 'app-box-info-widget',
    templateUrl: './box-info-widget.component.html',
    styleUrl: './box-info-widget.component.scss'
})
export class BoxInfoWidgetComponent {

    private static readonly defaultDateInterval = DateIntervalSpecifier.LAST_MONTH;
    private static readonly defaultReasons = Object.values(BoxStatusChangeReason).filter(r => r !== BoxStatusChangeReason.CORRECTED);
    private static readonly defaultLimit = 10;

    private readonly boxService = inject(DepartmentBoxService)

    public readonly dateInterval = input<DateIntervalSpecifier>()
    public readonly reasons = input<Array<BoxStatusChangeReason>>();
    public readonly limit = input<number>();

    protected boxInfo: Array<BoxStatusWithDepartmentBrief>;

    constructor() {
        effect(() => this.loadBoxInfo());
    }

    private loadBoxInfo(): void {
        this.boxService.findBoxStatuses(this.generatePageQuery()).subscribe(statusPage => {
            this.boxInfo = statusPage.items;
        });
    }

    private generatePageQuery(): PageQuery {
        const startDate = dateIntervalGeneratorFactory(
            _.defaultTo(this.dateInterval(), BoxInfoWidgetComponent.defaultDateInterval)).generate().dateFrom;
        return {
            page: 1,
            size: _.defaultTo(this.limit(), BoxInfoWidgetComponent.defaultLimit),
            where: {
                'dateTime': FilterOperationBuilder.gte(startDate),
                'reason': FilterOperationBuilder.in(_.defaultTo(this.reasons(), BoxInfoWidgetComponent.defaultReasons))
            },
            sort: {dateTime: 'DESC'}
        };
    }

}
