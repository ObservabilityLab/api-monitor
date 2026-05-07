import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';

import { BaseChartDirective } from 'ng2-charts';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-response-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './response-chart.html',
  styleUrl: './response-chart.css',
})
export class ResponseChart {
  @Input() history: any[] = [];

  get chartData() {
    return {
      labels: this.history.map((item) => new Date(item.timestamp).toLocaleTimeString()),

      datasets: [
        {
          data: this.history.map((item) => item.responseTime),
          label: 'Response Time (ms)',
        },
      ],
    };
  }
}
