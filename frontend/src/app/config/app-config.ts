import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

export interface AppConfiguration {
    baseURL: string;
}

@Injectable()
export class AppConfig {

    private static config: AppConfiguration;

    constructor(private readonly httpBe: HttpBackend) {
    }

    public loadConfig(): Promise<void> {
        // Create HttpClient here to bypass the interceptors that the main HttpClient includes.
        const http = new HttpClient(this.httpBe);

        return firstValueFrom(http.get<AppConfiguration>('/assets/app-config.json'))
            .then(data => {
                AppConfig.config = data;
            })
    }

    public static get(key: keyof AppConfiguration): string {
        return AppConfig.config[key];
    }

}

export const appConfigInitializerFn = (appConfig: AppConfig): () => Promise<void> => ((): Promise<void> => appConfig.loadConfig());
