import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { ApiService } from '@infordevjournal/core/http-client';
import { MockProvider } from 'ng-mocks';
import { ProfileLibService } from './profile-lib.service';

describe('ProfileLivService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileLibService, MockProvider(ApiService)],
    });
  });

  it('should be created', inject([ProfileLibService], (service: ProfileLibService) => {
    expect(service).toBeTruthy();
  }));
});
