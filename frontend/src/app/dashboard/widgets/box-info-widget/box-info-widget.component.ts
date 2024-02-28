import {Component, Input, OnInit} from '@angular/core';
import {BoxStatusChangeReason} from '@shared/department/box/box-status-change-reason';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {BoxStatusWithDepartmentBrief} from '@shared/department/box/department-box-status';
import {dateIntervalGeneratorFactory, DateIntervalSpecifier} from '@shared/util/date-interval-generator';
import {FilterOperationBuilder} from '@shared/api-util/filter-options';
import {PageQuery} from '@shared/api-util/pageable';
import _ from 'lodash';

@Component({
    selector: 'app-box-info-widget',
    templateUrl: './box-info-widget.component.html',
    styleUrl: './box-info-widget.component.scss'
})
export class BoxInfoWidgetComponent implements OnInit {

    private static readonly defaultDateInterval = DateIntervalSpecifier.LAST_MONTH;
    private static readonly defaultReasons = Object.values(BoxStatusChangeReason).filter(r => r !== BoxStatusChangeReason.CORRECTED);
    private static readonly defaultLimit = 10;

    @Input()
    dateInterval?: DateIntervalSpecifier;

    @Input()
    reasons?: Array<BoxStatusChangeReason>;

    @Input()
    limit?: number;

    protected boxInfo: Array<BoxStatusWithDepartmentBrief>;

    constructor(private readonly boxService: DepartmentBoxService) {
    }

    public ngOnInit(): void {
        this.loadBoxInfo();
    }

    private loadBoxInfo(): void {
        this.boxService.findBoxStatuses(this.generatePageQuery()).subscribe(statusPage => {
            this.boxInfo = statusPage.items;
        });
    }

    private generatePageQuery(): PageQuery {
        const startDate = dateIntervalGeneratorFactory(
            _.defaultTo(this.dateInterval, BoxInfoWidgetComponent.defaultDateInterval)).generate().dateFrom;
        return {
            page: 1,
            size: _.defaultTo(this.limit, BoxInfoWidgetComponent.defaultLimit),
            where: {
                'dateTime': FilterOperationBuilder.gte(startDate),
                'reason': FilterOperationBuilder.in(_.defaultTo(this.reasons, BoxInfoWidgetComponent.defaultReasons))
            },
            sort: {dateTime: 'DESC'}
        };
    }

}
