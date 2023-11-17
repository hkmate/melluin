import {Component, Input, OnInit} from '@angular/core';
import {BoxStatusChangeReason} from '@shared/department/box/box-status-change-reason';
import {DepartmentBoxService} from '@fe/app/hospital/department-box/department-box.service';
import {BoxStatusWithDepartmentBrief} from '@shared/department/box/department-box-status';
import {dateIntervalGeneratorFactory, DateIntervalSpecifier} from '@shared/util/date-interval-generator';
import {FilterOperationBuilder} from '@shared/api-util/filter-options';
import {PageQuery} from '@shared/api-util/pageable';

@Component({
    selector: 'app-box-info-widget',
    templateUrl: './box-info-widget.component.html',
    styleUrl: './box-info-widget.component.scss'
})
export class BoxInfoWidgetComponent implements OnInit {

    @Input()
    dateInterval: DateIntervalSpecifier = DateIntervalSpecifier.LAST_MONTH;

    @Input()
    reasons: Array<BoxStatusChangeReason> = Object.values(BoxStatusChangeReason).filter(r => r !== BoxStatusChangeReason.CORRECTED);

    @Input()
    limit: number = 10;

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
        const startDate = dateIntervalGeneratorFactory(this.dateInterval).generate().dateFrom;
        return {
            page: 1,
            size: this.limit,
            where: {
                'dateTime': FilterOperationBuilder.gte(startDate),
                'reason': FilterOperationBuilder.in(this.reasons)
            },
            sort: {dateTime: 'DESC'}
        };
    }

}
