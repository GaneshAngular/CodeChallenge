import { Routes } from '@angular/router';

export const routes: Routes = [{
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
  path:'live/interview/:id',
  loadComponent: () => import('./pages/live-interview/live-interview.component').then(m => m.LiveInterviewComponent)
}];
