import { TestBed } from '@angular/core/testing';

import { PurchaseDetailsServiceService } from './purchase-details.service.service';

describe('PurchaseDetailsServiceService', () => {
  let service: PurchaseDetailsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseDetailsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
