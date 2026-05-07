import { computed, Injectable, signal } from '@angular/core';

export interface ApiHistory {
  timestamp: number;
  responseTime: number;
}

export interface ApiEndpoint {
  name: string;
  url: string;
  status: string;
  time: number;
  history: ApiHistory[];
}

@Injectable({
  providedIn: 'root',
})
export class EndpointState {
  endpoints = signal<ApiEndpoint[]>([
    {
      name: 'Users API',
      url: 'https://jsonplaceholder.typicode.com/users',
      status: 'OK',
      time: 0,
      history: [],
    },
  ]);

  healthyCount = computed(() => {
    return this.endpoints().filter((endpoint) => endpoint.status === 'OK').length;
  });

  failedCount = computed(() => {
    return this.endpoints().filter((endpoint) => endpoint.status === 'FAIL').length;
  });

  totalCount = computed(() => {
    return this.endpoints().length;
  });

  addEndpoint(endpoint: ApiEndpoint) {
    this.endpoints.update((current) => [...current, endpoint]);
  }

  updateEndpoint(url: string, updates: Partial<ApiEndpoint>) {
    this.endpoints.update((current) =>
      current.map((endpoint) => {
        if (endpoint.url === url) {
          const updatedHistory = [
            ...endpoint.history,
            {
              timestamp: Date.now(),
              responseTime: updates.time || 0,
            },
          ].slice(-20);

          return {
            ...endpoint,
            ...updates,
            history: updatedHistory,
          };
        }

        return endpoint;
      }),
    );
  }
}
