import { CanDeactivateFn } from '@angular/router';
import { LiveChallengeComponent } from '../../../pages/live-challenge/live-challenge.component';

export const restrictChallengePageGuard: CanDeactivateFn<LiveChallengeComponent> = (component) => {
  console.log('🚀 CanDeactivate Guard Triggered!'); 
  return component.canDeactivate();
};
