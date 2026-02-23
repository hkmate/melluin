import {Component, inject, signal} from '@angular/core';
import {AppTitle} from '@fe/app/app-title.service';
import {selectUserWidgetsSettings} from '@fe/app/state/selector/user-settings.selector';
import {Store} from '@ngrx/store';
import {isNil} from '@melluin/common';
import {WidgetComponentInfo, widgetToComponent} from '@fe/app/dashboard/widget-settings-to-component-mapper';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgComponentOutlet, NgTemplateOutlet} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIcon} from '@angular/material/icon';


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

    private readonly store = inject(Store);
    private readonly title = inject(AppTitle);

    protected readonly widgets = signal<Array<WidgetComponentInfo>>([]);

    constructor() {
        this.title.setTitleByI18n('Titles.Dashboard');
        this.store.pipe(selectUserWidgetsSettings, takeUntilDestroyed()).subscribe({
            next: widgets => {
                if (isNil(widgets)) {
                    return;
                }
                const widgetList = Object.values(widgets);
                widgetList.sort((a, b) => a.index - b.index);
                this.widgets.set(widgetList.filter((value): boolean => value.needed).map(widgetToComponent));
            }
        });
    }

}
