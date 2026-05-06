import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EndpointState } from '../../core/services/endpoint-state';

@Component({
  selector: 'app-endpoints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './endpoints.html',
  styleUrl: './endpoints.css',
})
export class Endpoints {
  endpointName = '';
  endpointUrl = '';
  constructor(private endpointState: EndpointState) {}

  addEndpoint() {
    if (!this.endpointName.trim() || !this.endpointUrl.trim()) return;

    this.endpointState.addEndpoint({
      name: this.endpointName,
      url: this.endpointUrl,
      status: 'PENDING',
      time: 0,
    });

    this.endpointName = '';
    this.endpointUrl = '';
  }
}
