import {Component, effect, ElementRef, input, viewChild} from '@angular/core';
import {isNotNil} from '@shared/util/util';
import {Chart} from 'chart.js';
import {ChartConfiguration} from 'chart.js/dist/types';

@Component({
    selector: 'app-chart',
    standalone: true,
    imports: [],
    template: `
        <canvas #chartCanvas></canvas>`,
    styleUrl: './chart.component.scss'
})
export class ChartComponent {

    public readonly chartId = input.required<string>();
    public readonly data = input.required<ChartConfiguration>();

    protected readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

    protected chart: Chart;

    constructor() {
        effect(() => {
            const canvas = this.canvas()?.nativeElement;
            if (isNotNil(canvas)) {
                this.chart = new Chart(canvas, this.data());
            }
        });
    }

}
