import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EndpointState } from '../../core/services/endpoint-state';
import { Monitor } from '../../core/services/monitor';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  apis;

  constructor(
    private endpointState: EndpointState,
    private monitorService: Monitor,
  ) {
    this.apis = this.endpointState.endpoints;
  }

  async checkApi(api: any) {
    const result = await this.monitorService.checkEndpoint(api.url);

    api.status = result.status;
    api.time = result.time;
  }
}
