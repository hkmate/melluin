import {Component, inject} from '@angular/core';
import {AppTitle} from '@fe/app/app-title.service';
import {selectUserWidgetsSettings} from '@fe/app/state/selector/user-settings.selector';
import {Store} from '@ngrx/store';
import {isNil} from '@shared/util/util';
import {WidgetComponentInfo, widgetToComponent} from '@fe/app/dashboard/widget-settings-to-component-mapper';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    private readonly store = inject(Store);
    private readonly title = inject(AppTitle);

    protected widgets: Array<WidgetComponentInfo>;

    constructor() {
        this.title.setTitleByI18n('Titles.Dashboard');
        this.store.pipe(selectUserWidgetsSettings, takeUntilDestroyed()).subscribe({
            next: widgets => {
                if (isNil(widgets)) {
                    return;
                }
                const widgetList = Object.values(widgets);
                widgetList.sort((a, b) => a.index - b.index);
                this.widgets = widgetList.filter((value): boolean => value.needed).map(widgetToComponent);
            }
        });
    }

}
