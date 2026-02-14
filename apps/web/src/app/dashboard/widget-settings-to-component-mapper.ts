import {Type} from '@angular/core';
import {DepartmentBoxWidgetSettings, WidgetSetting, WidgetType} from '@shared/user/user-settings';
import {BoxInfoWidgetComponent} from '@fe/app/dashboard/widgets/box-info-widget/box-info-widget.component';


export interface WidgetComponentInfo {
    component: Type<unknown>;
    inputs: Record<string, unknown>;
}

export function widgetToComponent(settings: WidgetSetting): WidgetComponentInfo {
    switch (settings.type) {
        case WidgetType.DEPARTMENT_BOX:
            return generateBoxInfoWidgetInfo(settings as DepartmentBoxWidgetSettings);
        default:
            throw new Error(`Unknown widget type: ${settings.type}`);
    }
}

function generateBoxInfoWidgetInfo(settings: DepartmentBoxWidgetSettings): WidgetComponentInfo {
    return {
        component: BoxInfoWidgetComponent,
        inputs: {
            dateInterval: settings.dateInterval,
            reasons: settings.reasons,
            limit: settings.limit
        }
    };
}
