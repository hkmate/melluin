import {appConfig} from './app/app.config';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from '@fe/app/app.component';
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

bootstrapApplication(AppComponent, appConfig)
    .catch(err => console.error(err));
