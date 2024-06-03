import { TestBed, inject } from '@angular/core/testing';
import { WSService } from './ws.service';

describe('WSService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', inject([], (service: WSService) => {
    expect(service).toBeTruthy();
  }));
});
