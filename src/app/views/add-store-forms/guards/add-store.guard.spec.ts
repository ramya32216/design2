import { TestBed } from '@angular/core/testing';

import { AddStoreGuard } from './add-store.guard';

describe('AddStoreGuard', () => {
  let guard: AddStoreGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AddStoreGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
