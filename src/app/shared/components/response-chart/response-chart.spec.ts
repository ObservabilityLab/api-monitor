import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseChart } from './response-chart';

describe('ResponseChart', () => {
  let component: ResponseChart;
  let fixture: ComponentFixture<ResponseChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponseChart],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponseChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
