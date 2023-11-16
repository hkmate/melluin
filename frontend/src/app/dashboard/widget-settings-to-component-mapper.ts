import {Type} from '@angular/core';
import {WidgetSetting} from '@shared/user/user-settings';
import {cast} from '@shared/util/test-util';


export interface WidgetComponentInfo {
    component: Type<unknown>;
    inputs: Record<string, unknown>;
}

export function widgetToComponent(settings: WidgetSetting): WidgetComponentInfo {
    return cast<WidgetComponentInfo>(undefined);
}
