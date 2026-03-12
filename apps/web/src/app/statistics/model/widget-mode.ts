import {EnumTypeOf} from '@melluin/common';

export const WidgetModes = {
    CHART: 'CHART',
    TABLE: 'TABLE',
} as const;

export type WidgetMode = EnumTypeOf<typeof WidgetModes>;
