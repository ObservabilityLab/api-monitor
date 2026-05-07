import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EndpointState } from '../../core/services/endpoint-state';
import { Monitor } from '../../core/services/monitor';
import { ResponseChart } from '../../shared/components/response-chart/response-chart';
import { ApiService } from '../../core/services/api';

// Define the trend type at the top of your component
type TrendType = 'improving' | 'degrading' | 'stable';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ResponseChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  apis;
  intervalId: any;
  healthyCount: any;
  failedCount: any;
  totalCount: any;

  constructor(
    private endpointState: EndpointState,
    private monitorService: Monitor,
    private apiService: ApiService,
  ) {
    this.apis = this.endpointState.endpoints;
    this.healthyCount = this.endpointState.healthyCount;
    this.failedCount = this.endpointState.failedCount;
    this.totalCount = this.endpointState.totalCount;
  }

  async checkApi(api: any) {
    const result = await this.monitorService.checkEndpoint(api.url);

    this.endpointState.updateEndpoint(api.url, {
      status: result.status,
      time: result.time,
    });
  }

  ngOnInit() {
    this.loadEndpoints();
    this.startMonitoring();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startMonitoring() {
    this.checkAllApis();

    this.intervalId = setInterval(
      () => {
        this.checkAllApis();
      },
      24 * 60 * 60 * 1000,
    );
  }

  async checkAllApis() {
    for (const api of this.apis()) {
      const result = await this.monitorService.checkEndpoint(api.url);

      this.endpointState.updateEndpoint(api.url, {
        status: result.status,
        time: result.time,
      });
    }
  }

  loadEndpoints() {
    this.apiService.getEndpoints().subscribe((endpoints) => {
      this.endpointState.endpoints.set(
        endpoints.map((endpoint) => ({
          ...endpoint,
          status: 'OK',
          time: 0,
          history: [],
        })),
      );
    });
  }

  //  helper methods
  calculateAverage(history: any[]): number {
    if (!history || history.length === 0) return 0;
    const sum = history.reduce((acc, entry) => acc + entry.responseTime, 0);
    return Math.round(sum / history.length);
  }

  findMin(history: any[]): number {
    if (!history || history.length === 0) return 0;
    return Math.min(...history.map((entry) => entry.responseTime));
  }

  findMax(history: any[]): number {
    if (!history || history.length === 0) return 0;
    return Math.max(...history.map((entry) => entry.responseTime));
  }

  calculatePercentile(history: any[], percentile: number): number {
    if (!history || history.length === 0) return 0;
    const times = history.map((entry) => entry.responseTime).sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * times.length) - 1;
    return times[index];
  }

  // Update getTrend to return the specific type
  getTrend(history: any[]): TrendType {
    if (!history || history.length < 2) return 'stable';

    const recent = history.slice(-5);
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));

    const avgFirst = this.calculateAverage(firstHalf);
    const avgSecond = this.calculateAverage(secondHalf);

    const percentChange = ((avgSecond - avgFirst) / avgFirst) * 100;

    if (percentChange < -10) return 'improving';
    if (percentChange > 10) return 'degrading';
    return 'stable';
  }

  // Then getTrendClass becomes simple and type-safe
  getTrendClass(history: any[]): string {
    const classMap: Record<TrendType, string> = {
      improving: 'text-green-600',
      degrading: 'text-red-600',
      stable: 'text-gray-600',
    };

    return classMap[this.getTrend(history)];
  }
  getLastUpdateTime(history: any[]): string {
    if (!history || history.length === 0) return 'Never';
    const lastEntry = history[history.length - 1];
    if (!lastEntry || !lastEntry.timestamp) return 'Unknown';

    const date = new Date(lastEntry.timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffMinutes < 1440)
      return `${Math.floor(diffMinutes / 60)} hour${Math.floor(diffMinutes / 60) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }
}
