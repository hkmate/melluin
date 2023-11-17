import {Component, OnInit} from '@angular/core';
import {AppTitle} from '@fe/app/app-title.service';
import {selectUserWidgetsSettings} from '@fe/app/state/selector/user-settings.selector';
import {Store} from '@ngrx/store';
import {AutoUnSubscriber} from '@fe/app/util/auto-un-subscriber';
import {isNil} from '@shared/util/util';
import {WidgetComponentInfo, widgetToComponent} from '@fe/app/dashboard/widget-settings-to-component-mapper';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends AutoUnSubscriber implements OnInit {

    protected widgets: Array<WidgetComponentInfo>;

    constructor(private readonly store: Store,
                private readonly title: AppTitle) {
        super();
    }

    public ngOnInit(): void {
        this.title.setTitleByI18n('Titles.Dashboard');
        this.addSubscription(this.store.pipe(selectUserWidgetsSettings), {
            next: widgets => {
                if (isNil(widgets)) {
                    return;
                }
                const widgetList = Object.values(widgets);
                widgetList.sort((a, b) => a.index - b.index);
                this.widgets = widgetList.filter(value => value.needed).map(widgetToComponent);
            }
        });
    }

}
