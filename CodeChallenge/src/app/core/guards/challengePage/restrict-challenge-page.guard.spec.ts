import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { restrictChallengePageGuard } from './restrict-challenge-page.guard';

describe('restrictChallengePageGuard', () => {
  const executeGuard: CanDeactivateFn<unknown> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => restrictChallengePageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
