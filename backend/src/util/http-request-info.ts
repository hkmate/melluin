export interface HttpRequestInfo {
    route: { path: string };
    query: Record<string, string>;
}
