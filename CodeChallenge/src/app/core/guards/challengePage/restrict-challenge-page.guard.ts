import { CanDeactivateFn } from '@angular/router';
import { LiveChallengeComponent } from '../../../pages/live-challenge/live-challenge.component';
import { Observable } from 'rxjs';

export interface CanDeactivatePage{
  canDeactivate(): boolean | Promise<boolean> | Observable<boolean>;
}

export const restrictChallengePageGuard: CanDeactivateFn<LiveChallengeComponent> = (component:LiveChallengeComponent) => {



  return component.canDeactivate();
};
