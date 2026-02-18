export interface HttpRequestInfo {
    url: string;
    query: Record<string, string>;
    body: unknown
}
