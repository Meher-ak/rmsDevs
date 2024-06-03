import { TestBed, inject } from '@angular/core/testing';
import { WSState } from './ws.state';

describe('WSState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WSState],
    });
  });

  it('should be created', inject([WSState], (service: WSState) => {
    expect(service).toBeTruthy();
  }));
});
