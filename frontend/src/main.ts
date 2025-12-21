import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import 'reflect-metadata';
import {AppModule} from './app/app.module';

import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    LogarithmicScale,
    Tooltip
} from 'chart.js';

Chart.register(BarController, LinearScale, CategoryScale, BarElement, Legend, Tooltip, LogarithmicScale);

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
