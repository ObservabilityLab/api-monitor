import { TestBed } from '@angular/core/testing';

import { EndpointState } from './endpoint-state';

describe('EndpointState', () => {
  let service: EndpointState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndpointState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
