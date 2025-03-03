import { Routes } from '@angular/router';
import { restrictChallengePageGuard } from './core/guards/challengePage/restrict-challenge-page.guard';
import { LiveChallengeComponent } from './pages/live-challenge/live-challenge.component';

export const routes: Routes = [
  { path:'api',
    loadComponent:()=>import('./pages/layout/layout.component').then(t=>t.LayoutComponent),
    children:[
      {
         path:'',
         redirectTo:'dashboard',
         pathMatch:'full'
      },
     {
  path: 'dashboard',
  loadComponent: () => import('./pages/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
  children:[
    {
      path:'',
      redirectTo:'interviews',
      pathMatch:'full'
    },{
      path:'interviews',
      loadComponent:()=> import('./pages/dashboard/interview/interview.component').then(i=>i.InterviewComponent)
    },{
      path:'sessions',
      loadComponent:()=> import('./pages/dashboard/session/session.component').then(i=>i.SessionComponent)
    },{
      path:'projects',
      loadComponent:()=> import('./pages/dashboard/project/project.component').then(i=>i.ProjectComponent)
    }
  ]
},{
  path:'login',
  loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
}]},{
  path:'live/challenge/:id',
  component:LiveChallengeComponent,
  // loadComponent:()=>import('./pages/live-challenge/live-challenge.component').then(i=>i.LiveChallengeComponent),
  canDeactivate:[restrictChallengePageGuard],
},{
  path:'live/interview/:id',
  loadComponent: () => import('./pages/live-interview/live-interview.component').then(m => m.LiveInterviewComponent)
}];
