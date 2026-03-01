import {Component, computed, inject} from '@angular/core';
import {AppTitle} from '@fe/app/app-title.service';
import {DashboardWidgetSettings, isNil, WidgetSetting} from '@melluin/common';
import {WidgetComponentInfo, widgetToComponent} from '@fe/app/dashboard/widget-settings-to-component-mapper';
import {NgComponentOutlet, NgTemplateOutlet} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIcon} from '@angular/material/icon';
import {CurrentUserService} from '@fe/app/auth/service/current-user.service';


@Component({
    imports: [
        NgComponentOutlet,
        NgTemplateOutlet,
        TranslatePipe,
        MatIcon
    ],
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    private readonly title = inject(AppTitle);
    private readonly currentUserService = inject(CurrentUserService);

    protected readonly widgets = computed(() =>
        this.calculateWidgets(this.currentUserService.userSettings()?.dashboard?.widgets));

    constructor() {
        this.title.setTitleByI18n('Titles.Dashboard');
    }

    private calculateWidgets(setting: DashboardWidgetSettings | undefined): Array<WidgetComponentInfo> {
        if (isNil(setting)) {
            return [];
        }

        const widgetList = Object.values(setting) as Array<WidgetSetting>;
        widgetList.sort((a, b) => a.index - b.index);
        return widgetList.filter((value): boolean => value.needed).map(widgetToComponent);
    }

}
