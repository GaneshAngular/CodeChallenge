import { CanDeactivateFn, CanDeactivate } from '@angular/router';
import { LiveChallengeComponent } from '../../../pages/live-challenge/live-challenge.component';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

export const restrictChallengePageGuard: CanDeactivateFn<
  LiveChallengeComponent
> = (component, currentRoute, currentState, nextState) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
