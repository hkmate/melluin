export interface WidgetTableData<T> {
    headers: Record<keyof T, string>; // key -> translated
    data: Array<T>;
}

export type WidgetExportingInfo<T> = {
    fileName: string;
} & WidgetTableData<T>;
