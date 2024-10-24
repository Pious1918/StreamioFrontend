import { TestBed } from '@angular/core/testing';

import { AdminAuthgService } from './admin-authg.service';

describe('AdminAuthgService', () => {
  let service: AdminAuthgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAuthgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
