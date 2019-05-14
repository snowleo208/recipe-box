import { TestBed } from '@angular/core/testing';

import { AuthControllerService } from './auth-controller.service';

describe('AuthControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthControllerService = TestBed.get(AuthControllerService);
    expect(service).toBeTruthy();
  });
});
