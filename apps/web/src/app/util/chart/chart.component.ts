import {Component, effect, ElementRef, input, viewChild} from '@angular/core';
import {isNil, isNotNil} from '@shared/util/util';
import {Chart, Plugin} from 'chart.js';
import {ChartConfiguration} from 'chart.js/dist/types';
import * as _ from 'lodash';

@Component({
    selector: 'app-chart',
    standalone: true,
    imports: [],
    template: `
        <canvas #chartCanvas width="100%"></canvas>`,
    host: {
        style: `
            display: block;
            width: 100%;
            height: 500px;
            max-height: 70dvh;
    `
    }
})
export class ChartComponent {

    public static readonly emptyChartConfig: ChartConfiguration = {type: 'bar', data: {datasets: []}};

    public readonly data = input.required<ChartConfiguration>();

    protected readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

    protected chart: Chart;

    private readonly chartPlugin: Plugin = {
        id: 'whiteBackground',
        beforeDraw: (chart, args, options) => {
            const {ctx} = chart;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    constructor() {
        effect(() => {
            const canvas = this.canvas()?.nativeElement;
            if (isNil(canvas)) {
                return;
            }
            if (isNotNil(this.chart)) {
                this.chart.destroy();
            }
            this.chart = new Chart(canvas, this.mergeChartConfig());
        });
    }

    private mergeChartConfig(): ChartConfiguration {
        const defaultConfig: Partial<ChartConfiguration> = {
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
            plugins: [this.chartPlugin]
        };
        return _.merge({}, defaultConfig, this.data())
    }

}
