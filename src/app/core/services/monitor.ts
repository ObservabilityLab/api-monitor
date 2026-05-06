import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Monitor {
  constructor(private http: HttpClient) {}

  async checkEndpoint(url: string) {
    const start = performance.now();

    try {
      await this.http.get(url).toPromise();

      const end = performance.now();

      return {
        status: 'OK',
        time: Math.floor(end - start),
      };
    } catch {
      return {
        status: 'FAIL',
        time: 0,
      };
    }
  }
}
