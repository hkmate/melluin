export interface WidgetTableData {
    headers: Record<string, string>; // key -> translated
    data: Array<Record<string, string>>; // (key -> value)[]
}

export type WidgetExportingInfo = {
    fileName: string;
} & WidgetTableData;
