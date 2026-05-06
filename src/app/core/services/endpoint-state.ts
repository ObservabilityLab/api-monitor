import { Injectable, signal } from '@angular/core';

export interface ApiEndpoint {
  name: string;
  url: string;
  status: string;
  time: number;
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
      time: 120,
    },
  ]);

  addEndpoint(endpoint: ApiEndpoint) {
    this.endpoints.update((current) => [...current, endpoint]);
  }
}
