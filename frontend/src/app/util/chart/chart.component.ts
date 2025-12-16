import {Component, computed, effect, input, viewChild} from '@angular/core';
import {isNotNil} from '@shared/util/util';
import {Chart} from 'chart.js';
import {ChartConfiguration} from 'chart.js/dist/types';

@Component({
    selector: 'app-chart',
    standalone: true,
    imports: [],
    template: `
        <canvas [id]="chartInternalId()"></canvas>`,
    styleUrl: './chart.component.scss'
})
export class ChartComponent {

    public readonly chartId = input.required<string>();
    public readonly data = input.required<ChartConfiguration>();

    protected readonly chartInternalId = computed(() => `${this.chartId}__chart`);

    protected readonly canvas = viewChild<HTMLCanvasElement>(this.chartInternalId())

    protected chart: Chart;

    constructor() {
        effect(() => {
            const canvas = this.canvas();
            if (isNotNil(canvas)) {
                this.chart = new Chart(canvas, this.data());
            }
        });
    }

}
